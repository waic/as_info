using System;
using System.Data;
using System.Xml;
using System.Text.RegularExpressions;

public class AsTestResultTable : CsvDataTable, IComparable<AsTestResultTable>{


// テスト結果を格納するテーブル

	public static Regex TitleRegex = new Regex("^(.+)アクセシビリティサポーテッド検証結果\\s*\\[等級(A+)\\]");
	public string UserAgent{get; private set;}
	public string Grade{get; private set;}
	public bool UseAssistiveTechnology{get; private set;}

	public readonly string[] UserAgentSortList = new string[]{
		"Internet Explorer 6.0",
		"Internet Explorer 7.0",
		"Internet Explorer 8.0",
		"Internet Explorer 9",
		"Firefox 3.5",
		"Firefox 4.0",
		"Firefox 9.0",
		"Safari 3.2",
		"Safari 5.0.3",
		"JAWS for Windows 9.0",
		"ホームページ・リーダー 3.04",
		"PC-Talker XP 3.06",
		"PC-Talker XP 3.06 + NetReader 1.18",
		"FocusTalk V3",
		"NVDA 2010.1j",
		"NVDA 2011.1",
	};
	public AsTestResultTable(){
		this.TableName = "AsTestResult";
		ColumnSettings = new[]{
			null,
			IdColumnName,
			"検証結果",
			"操作手順",
			"備考"
		};
		CreateColumn();
	}
	
	
	public override void Load(string[][] alldata){
		base.Load(alldata);
		string titleData = alldata[0][1];
		Match m = TitleRegex.Match(titleData);
		if(m.Groups.Count < 3){
			throw new Exception("タイトルからブラウザと等級のデータを読みとれませんでした。読もうとしたデータ: " + titleData);
		}
		UserAgent = m.Groups[1].Value.Trim();
		Grade = m.Groups[2].Value.Trim();
		this.Name = UserAgent + " - " + Grade;
		string assistiveTechnologyDetection = alldata[6][1];
		UseAssistiveTechnology = assistiveTechnologyDetection.IndexOf("支援技術なし") < 0;
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

	public int CompareTo(AsTestResultTable other){
		int mySortIndex = Array.IndexOf(UserAgentSortList, this.UserAgent);
		int otherSortIndex = Array.IndexOf(UserAgentSortList, other.UserAgent);
		if(mySortIndex >= 0 && otherSortIndex < 0){
			return -1;
		}
		if(mySortIndex < 0 && otherSortIndex >= 0){
			return 1;
		}
		if(mySortIndex >= 0 && otherSortIndex >= 0){
			return mySortIndex - otherSortIndex;
		}
		if(this.UseAssistiveTechnology && !other.UseAssistiveTechnology){
			return 1;
		}
		if(!this.UseAssistiveTechnology && other.UseAssistiveTechnology){
			return -1;
		}
		return this.UserAgent.CompareTo(other.UserAgent);
	}


}


