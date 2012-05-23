using System;
using System.Data;
using System.IO;
using System.Xml;
using System.Text.RegularExpressions;

public class SuccessCriteriaTable : CsvDataTable{

	public string UserAgent{get; private set;}
	public string Grade{get; private set;}
	public const string FileExists = "ファイル有無";
	public const string NameColumnName = "name";
	public const string LevelColumnName = "達成等級";

	public SuccessCriteriaTable(){
		this.TableName = "SuccessCriteria";
		ColumnSettings = new[]{
			IdColumnName,
			LevelColumnName,
			NameColumnName,
			FileExists
		};
		CreateColumn();
	}

	protected override Regex GetIdMatchRule(){
		return new Regex("^[\\.0-9]+$");
	}



	public override XmlNode RowToXml(DataRow row, XmlDocument xml){
		XmlNode result = base.RowToXml(row,xml);
		foreach(string s in ColumnSettings){
			if(s == null) continue;
			if(s == IdColumnName) continue;
			XmlElement e = AppendElement(result, s, row[s]);
		}
		return result;
	}


	public override XmlDocument ToXml(){
		XmlDocument result = new XmlDocument(){XmlResolver = null};
		XmlElement rootNode = result.CreateElement(this.TableName);
		result.AppendChild(rootNode);

		foreach(string level in new[]{"A", "AA", "AAA"}){
			DataRow[] rows = this.Select(string.Format("[{0}]='{1}'", LevelColumnName, level));

			var levelGroupElement = result.CreateElement("SuccessCriteriaGroup");
			levelGroupElement.SetAttribute("level", level);

			foreach(DataRow row in rows){
				XmlNode x = RowToXml(row, result);
				if(x==null) continue;
				if(x.ChildNodes.Count==0) continue;
				XmlElement e = result.CreateElement("item");
				e.AppendChild(x);
				levelGroupElement.AppendChild(e);
			}
			rootNode.AppendChild(levelGroupElement);
		}
		return result;
	}


	// 達成基準に該当するファイルがあるかどうかチェックしつつデータを更新します。
	public void CheckFileExists(DirectoryInfo csvDir){
		foreach(DataRow r in this.Rows){
			string id = r[IdColumnName].ToString();
			FileInfo[] target = csvDir.GetFiles(id + ".csv");
			r[FileExists] = target.Length > 0;
		}
	}

	// 指定された達成基準の情報を返します。
	public XmlNode GetSuccessCriteriaInfo(XmlDocument xml, string id){
		DataRow r = this.Rows.Find(id);

		XmlNode result = xml.CreateDocumentFragment();

			string name = r[NameColumnName].ToString();
			string level = r[LevelColumnName].ToString();

			XmlElement sc = xml.CreateElement("SuccessCriteria");

			XmlElement numberElement = xml.CreateElement("number");
			numberElement.InnerText = id;
			sc.AppendChild(numberElement);

			XmlElement nameElement = xml.CreateElement("name");
			nameElement.InnerText = name;
			sc.AppendChild(nameElement);

			XmlElement levelElement = xml.CreateElement("level");
			levelElement.InnerText = level;
			sc.AppendChild(levelElement);
			
			result.AppendChild(sc);

		return result;
	}



}


