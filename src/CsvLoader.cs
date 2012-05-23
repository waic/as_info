using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Xsl;


public class CsvLoader{

	public const string InputCsvDirName = "..\\data\\csv";
	public const string InputXsltDirName = "..\\data\\xslt";
	public const string OutputXmlDirName = "..\\result\\xml";
	public const string OutputHtmlDirName = "..\\result\\html";

	// IDとテストのタイプの対応表
	// 手抜きなので、先頭文字が同じIDがあるとうまく動作しない
	public Dictionary<string, string> TestIdPrefeixAndTestType = new Dictionary<string, string>(){
		{"SCR", "Client-sideScripting"},
		{"H", "HTMLandXHTML"},
		{"C", "CSS"},
		{"G", "General"},
	};


	private DirectoryInfo CsvDir{get;set;}
	private DirectoryInfo OutputXmlDir{get;set;}
	private DirectoryInfo OutputHtmlDir{get;set;}
	private DirectoryInfo InputXsltDir{get;set;}
	private SuccessCriteriaTable SuccessCriteriaTable{get;set;}
	private AsTestResultTable[] AsTestResultTables{get;set;}
	private AsDescriptionTable[] AsDescriptionTables{get;set;}
	private string[] UserAgentList{get;set;}

	private Dictionary<string, XslCompiledTransform> xslts = new Dictionary<string, XslCompiledTransform>();
	private readonly string[] XsltFileNames = new string[]{"doc", "index", "cover"};

	public CsvLoader(DirectoryInfo baseDir){
		CsvDir = new DirectoryInfo(baseDir.FullName + '\\' + InputCsvDirName);
		if(!CsvDir.Exists){
			throw new Exception(string.Format("Directory not found: {0}", CsvDir.FullName));
		}
		OutputXmlDir = new DirectoryInfo(baseDir.FullName + '\\' + OutputXmlDirName);
		OutputHtmlDir = new DirectoryInfo(baseDir.FullName + '\\' + OutputHtmlDirName);
		InputXsltDir = new DirectoryInfo(baseDir.FullName + '\\' + InputXsltDirName);

		foreach(string s in XsltFileNames){
			var xslt = new XslCompiledTransform();
			FileInfo xsltFile = GetFileInfo(InputXsltDir, s + ".xsl");
			xslt.Load(xsltFile.FullName);
			xslts.Add(s, xslt);
		}

	}

	public void Execute(){
		Console.WriteLine("start.");
		Console.WriteLine();

		LoadTables(CsvDir);

		// 説明XML/HTMLを保存、
		foreach(AsDescriptionTable adt in AsDescriptionTables){
			FileInfo outputFile = GetFileInfo(OutputXmlDir, adt.Name + ".xml");
			XmlDocument xml = adt.ToXml();
			XmlNode scResult = SuccessCriteriaTable.GetSuccessCriteriaInfo(xml, adt.Name);
			xml.DocumentElement.PrependChild(scResult);

			SaveXml(xml, outputFile);
			SaveAllChildren(adt);
			FileInfo indexHtml = GetFileInfo(OutputHtmlDir, adt.Name + ".html");
			CreateHtml("index", xml, indexHtml);
		}

		// カバーページHTMLを保存
		var criteriaXml = SuccessCriteriaTable.ToXml();
		SaveXml(criteriaXml, GetFileInfo(OutputXmlDir, "success-criteria.xml"));
		CreateHtml("cover", criteriaXml, GetFileInfo(OutputHtmlDir, "index.html"));

		Console.WriteLine();
		Console.WriteLine("done.");
	}


	// 特定ディレクトリからCsvDataTableを一気に読み込みます。
	private void LoadTables(DirectoryInfo csvDir){
		FileInfo[] csvFiles = csvDir.GetFiles("*.csv");
		List<AsDescriptionTable> descTableList = new List<AsDescriptionTable>();
		List<AsTestResultTable> resultTableList = new List<AsTestResultTable>();
		foreach(FileInfo f in csvFiles){
			CsvDataTable cdt = CsvDataTable.CreateCsvDataTable(f);
			if(cdt is AsDescriptionTable) {
				descTableList.Add(cdt as AsDescriptionTable);
			} else if(cdt is AsTestResultTable) {
				resultTableList.Add(cdt as AsTestResultTable);
			} else if(cdt is SuccessCriteriaTable) {
				SuccessCriteriaTable = cdt as SuccessCriteriaTable;
				// 達成基準リストXMLにはファイル有無の情報を追加する
				SuccessCriteriaTable.CheckFileExists(csvDir);
			}
		}
		AsDescriptionTables = descTableList.ToArray();
		AsTestResultTables = resultTableList.ToArray();

		//UAのリストを作成
		resultTableList.Sort();
		List<string> uaList = new List<string>();
		foreach(var table in resultTableList){
			if(!uaList.Contains(table.UserAgent)) uaList.Add(table.UserAgent);
		}
		UserAgentList = uaList.ToArray();

		Console.WriteLine("以下のUserAgentのテスト結果をロードしました:");
		foreach(string s in uaList){
			Console.WriteLine(s);
		}
		Console.WriteLine("Load Completed.");
	}

	public static void SaveXml(Object o, FileInfo outputFile){
		if(o == null){
			Console.WriteLine("object null: {0}", outputFile.FullName);
			return;
		}
		XmlDocument xml = null;
		if(o is XmlDocument){
			xml = o as XmlDocument;
		} else if(o is CsvDataTable){
			xml = (o as CsvDataTable).ToXml();
		}
		outputFile.Directory.Create();
		xml.Save(outputFile.FullName);
		Console.WriteLine("Saved: {0}", outputFile.FullName);
	}


	// DescriptionのXML/HTMLをすべてSaveします。
	public void SaveAllChildren(AsDescriptionTable adt){
		foreach(DataRow row in adt.Rows){
			string id = row[AsDescriptionTable.IdColumnName].ToString();

			XmlDocument xml = new XmlDocument(){XmlResolver = null};
			XmlElement root = xml.CreateElement("description");
			xml.AppendChild(root);

			// 達成基準の情報を追加
			// ほかの達成基準からも参照されている可能性があるので全てのテーブルを見る
			
			int count = 0;
			foreach(AsDescriptionTable otherAdt in AsDescriptionTables){
				DataRow r = otherAdt.Rows.Find(id);
				if(r != null){
					XmlElement successCriteriaElement = xml.CreateElement("successCriteria");
					XmlNode scResult = SuccessCriteriaTable.GetSuccessCriteriaInfo(xml, otherAdt.Name);
					root.AppendChild(scResult);
					
					count++;
				}
			}

			if(count > 1){
				Console.WriteLine("multiple use: {0} ", id);
			}

			string testType = GetTestTypeById(id);
			if(testType != null){
				XmlElement testTypeElement = xml.CreateElement("testType");
				testTypeElement.InnerText = testType;
				root.AppendChild(testTypeElement);
			}

			root.AppendChild(adt.RowToXml(row, xml));

			XmlElement testDetail = xml.CreateElement("testDetail");
			XmlNode testDetailNode = GetTestDetail(id, xml);
			if(testDetail != null){
				testDetail.AppendChild(testDetailNode);
				root.AppendChild(testDetail);
			} else {
				Console.Error.WriteLine("testDetailが取得できませんでした : {0}", id);
			}

			FileInfo outputXml = GetFileInfo(OutputXmlDir, id + ".xml");
			SaveXml(xml, outputXml);

			FileInfo outputHtml = GetFileInfo(OutputHtmlDir, id + ".html");
			CreateHtml("doc", xml, outputHtml);
		}
	}


	// idを指定して、AsTestResultTableからテスト詳細を取得します。
	private XmlNode GetTestDetail(string id, XmlDocument xml){
		var result = xml.CreateDocumentFragment();
		foreach(string userAgent in UserAgentList){
			var resultElement = xml.CreateElement("result");
			resultElement.SetAttribute("useragent", userAgent);
			resultElement.AppendChild(GetTestDetail(id, xml, userAgent));
			result.AppendChild(resultElement);
		}
		return result;
	}

	// ブラウザ名とIDを指定して、AsTestResultTableからテスト詳細を取得します。
	private XmlNode GetTestDetail(string id, XmlDocument xml, string userAgent){
		Console.WriteLine("ID:{0}, UA:{1}の詳細テストデータを検索します。", id, userAgent);
		try{
			foreach(var table in AsTestResultTables){
				Console.WriteLine("テーブル:{0} (UA:{1})を検索。", table.Name, table.UserAgent);
				if(table.UserAgent.Equals(userAgent, StringComparison.InvariantCultureIgnoreCase)){
					XmlNode result = table.GetXmlById(id, xml);
					if(result != null) return result;
				}
			}
		}catch(Exception e){
			Console.WriteLine("ID:{0}, UA:{1}の詳細テストデータの検索時にエラーが発生しました。[{2}]", id, userAgent, e);
		}
		Console.WriteLine("ID:{0}, UA:{1}の詳細テストデータがみつかりませんでした。", id, userAgent);
		return xml.CreateDocumentFragment();
	}


	//IDを指定して、テスト種別 (HTMLandXHTMLなど) を取得します。
	private string GetTestTypeById(string id){
		foreach(string key in TestIdPrefeixAndTestType.Keys){
			if(id.IndexOf(key) == 0) return TestIdPrefeixAndTestType[key];
		}
		return null;
	}

	// DirectoryInfoとファイル名からFileInfoを取得します。
	private static FileInfo GetFileInfo(DirectoryInfo dir, string filename){
		FileInfo result = new FileInfo(dir.FullName + "\\" + filename.Trim('\\'));
		return result;
	}



	// XSLTプロセッサを使用して XML を HTML に変換します。
	private void CreateHtml(string processorName, XmlDocument xml, FileInfo outputFile){
		var xslt = xslts[processorName];
		outputFile.Directory.Create();
		using(XmlWriter result = XmlWriter.Create(outputFile.FullName, xslt.OutputSettings)){
			xslt.Transform(xml, result);
			Console.WriteLine("Generated: {0}", outputFile.FullName);
		}
	}

}


