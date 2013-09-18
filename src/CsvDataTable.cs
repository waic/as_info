using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Data;
using System.Xml;

public abstract class CsvDataTable : DataTable{

	private static Regex CsvFragmentReg = new Regex("(\"(?:[^\"]|\"\")*\"|[^,]*),");
	public static Regex IdReg = new Regex("^[A-Za-z]+[-0-9]+[a-z]?$");
	public static Encoding Sjis = Encoding.GetEncoding("Shift_JIS");
	public const string IdColumnName = "id";
	public const string NumberColumnName = "rownumber";

	public string[] ColumnSettings{get; set;}
	protected int IdColumnIndex{get; set;}
	public string Name{get;set;}


	public virtual void Load(FileInfo file){
		string[][] alldata = LoadCSV(file);
		Load(alldata);
	}

	protected virtual Regex GetIdMatchRule(){
		return IdReg;
	}


	public virtual void Load(string[][] alldata){
		foreach(string[] linedata in alldata){
			// ID が不適切なものはスキップ
			string id = linedata[IdColumnIndex];
			Regex matchRule = GetIdMatchRule();
			if(!matchRule.IsMatch(id)) continue;
			if(this.Rows.Find(id) != null) continue;
//			Console.Write("{0} ", id);
			DataRow r = this.NewRow();
			for(int i=0; i < ColumnSettings.Length; i++){
				string name = ColumnSettings[i];
				if(name == null) continue;
				if(linedata.Length <= i){
					Console.WriteLine("Load Error: Cannot Read {0} from: {1}", name, string.Join(",", linedata));
					continue;
				}
				string data = linedata[i];
				r[name] = data;
			}
			this.Rows.Add(r);
		}
	}


	public void CreateColumn(string[] columnSettings){
		ColumnSettings = columnSettings;
		CreateColumn();
	}


	public void CreateColumn(){
		DataColumn autoNumberingCol = new DataColumn(NumberColumnName, typeof(int));
		autoNumberingCol.AutoIncrement = true;
		autoNumberingCol.AutoIncrementSeed = 1;
		//autoNumberingCol.Unique = true;
		this.Columns.Add(autoNumberingCol);

		for(int i=0; i < ColumnSettings.Length; i++){
			string columnName = ColumnSettings[i];
			if(string.IsNullOrEmpty(columnName)) continue;
			DataColumn column = new DataColumn(columnName, typeof(string));
			column.AllowDBNull = true;
			this.Columns.Add(column);
			if(columnName == IdColumnName){
				column.Unique = true;
				column.AllowDBNull = false;
				this.PrimaryKey = new[]{column};
				IdColumnIndex = i;
			}
		}

	}


	public virtual XmlDocument ToXml(){
		XmlDocument result = new XmlDocument(){XmlResolver = null};
		XmlElement rootNode = result.CreateElement(this.TableName);
		result.AppendChild(rootNode);
		foreach(DataRow row in this.Rows){
			XmlNode x = RowToXml(row, result);
			if(x==null) continue;
			if(x.ChildNodes.Count==0) continue;
			XmlElement e = result.CreateElement("item");
			e.AppendChild(x);
			rootNode.AppendChild(e);
		}
		return result;
	}


	public XmlNode GetXmlById(string id, XmlDocument owner){
		DataRow row = this.Rows.Find(id);
		if(row == null){
			Console.WriteLine("テーブル{0}にID:{1}のデータが見つかりませんでした。", this.Name, id);
			return null;
		}
		return RowToXml(row, owner);
	}


	public virtual XmlNode RowToXml(DataRow row, XmlDocument xml){
		XmlNode result = xml.CreateDocumentFragment();
		AppendElement(result, NumberColumnName, row[NumberColumnName]);
		AppendElement(result, IdColumnName, row[IdColumnName]);
		return result;
	}

//public static


	// CSVファイルから適切なCsvDataTableの派生クラスを作るファクトリメソッド
	public static CsvDataTable CreateCsvDataTable(FileInfo file){
		string[][] alldata = LoadCSV(file);
		CsvDataTable result = null;
		try{
			if(alldata[0][0].StartsWith("テストファイルNo.")){
				result = new AsDescriptionTable();
				result.Name = Path.GetFileNameWithoutExtension(file.Name);
			} else if(alldata[0][1].IndexOf("アクセシビリティサポーテッド検証結果") >= 0){
				result = new AsTestResultTable();
			} else {
				result = new SuccessCriteriaTable();
			}
			if(result == null) return null;
			Console.WriteLine("Load start: {0}", file.FullName);
			result.Load(alldata);
			Console.WriteLine("Loaded: {0} rows ({1} : {2})", result.Rows.Count, result.GetType(), result.Name);
			
			return result;
		} catch (Exception e){
			throw new Exception(string.Format("データが読めませんでした。{0} \n {1}", file.FullName, alldata[0][1]), e);
		}
	}





// protected static

	protected static string[][] LoadCSV(FileInfo file){
		string[] fileLines = GetFileLines(file);
		List<string[]> result = new List<string[]>();

		for(int i=0; i < fileLines.Length; i++){
			string line = fileLines[i];
			while (countChars(line, '"') % 2 > 0 && ++i < fileLines.Length) {
				line += "\n";
				line += fileLines[i];
			}
			line += ',';
			result.Add(GetDataFromLine(line));
		}
		return result.ToArray();
	}


	protected static string[] GetFileLines(FileInfo file){
		if(!file.Exists) return new string[0];
		string fileData = null;
		using(FileStream fs = file.Open(FileMode.Open, FileAccess.Read, FileShare.Read))
		using(StreamReader sr = new StreamReader(fs, Sjis)){
			fileData = sr.ReadToEnd();
		}
		if(string.IsNullOrEmpty(fileData)) return new string[0];
		string[] result = fileData.Split(new string[]{"\x0d\x0a", "\x0a", "\x0d"}, StringSplitOptions.RemoveEmptyEntries);
		return result;
	}


	protected static int countChars(string str, char c){
		int result = 0;
		foreach(char tmp in str){
			if(tmp == c) result++;
		}
		return result;
	
	}


	protected static  string[] GetDataFromLine(string line){
		MatchCollection matches = CsvFragmentReg.Matches(line);
		string[] result = new string[matches.Count];

		for(int i=0; i<matches.Count; i++){
			string val = matches[i].Groups[1].Value;
			if(val.StartsWith("\"")) val = val.Remove(0,1);
			if(val.EndsWith("\"")) val = val.Remove(val.Length-1);
			val = val.Replace("\"\"", "\"");
			result[i] = val.Trim();
		}
		return result;
	}


	public static XmlElement AppendElement(XmlNode target, string elementName, object inner){
		try{
			XmlElement e = target.OwnerDocument.CreateElement(elementName);
			if(inner is XmlNode){
				XmlNode innerNode = inner as XmlNode;

				if(string.IsNullOrEmpty(innerNode.InnerText)) return null;
				e.AppendChild(innerNode);
				target.AppendChild(e);
				return e;
			}
			if(string.IsNullOrEmpty(inner.ToString())) return null;
			e.InnerText = inner.ToString();
			target.AppendChild(e);
			return e;
		}catch (Exception e){
			Console.Error.WriteLine("[{0}]", target);
			Console.Error.WriteLine("[{0}]", elementName);
			Console.Error.WriteLine("[{0}]", inner);
			Console.Error.WriteLine(e);
			throw;
		}
	}


}

