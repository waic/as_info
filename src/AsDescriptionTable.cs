using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;

public class AsDescriptionTable : CsvDataTable{

// AS情報を格納するテーブル

	public const string NoticeColumnName = "注意点";
	public const string AlternateMethodColumnName = "代替もしくは推奨する方法";
	public const string NoticeSeparateChars = "【】";
	public const string TitleColumnName = "実装方法タイトル";
	public static Regex TitleDeletePattern = new Regex(@"^[A-Z]+[0-9]+: ");

	public AsDescriptionTable(){
		this.TableName = "AsDescription";
		ColumnSettings = new[]{
			IdColumnName,
			TitleColumnName,
			"対象",
			"見解",
			AlternateMethodColumnName,
			NoticeColumnName,
			"備考",
		};
		CreateColumn();
	}

	public override XmlDocument ToXml(){
		XmlDocument result = base.ToXml();
		result.DocumentElement.SetAttribute("target", this.Name);
		return result;
	}


	public override XmlNode RowToXml(DataRow row, XmlDocument xml){
		XmlNode result = base.RowToXml(row, xml);
		foreach(string s in ColumnSettings){
			if(s == null) continue;
			if(s == IdColumnName) continue;
			if(s.Equals(NoticeColumnName, StringComparison.InvariantCultureIgnoreCase)){
				AppendElement(result, s, GetBodyElement(xml, row[s].ToString()));
				continue;
			}
			if(s.Equals(NoticeColumnName, StringComparison.InvariantCultureIgnoreCase) || s.Equals(AlternateMethodColumnName, StringComparison.InvariantCultureIgnoreCase)){
				AppendElement(result, s, GetBodyElement(xml, row[s].ToString()));
				continue;
			}
			if(s.Equals(TitleColumnName, StringComparison.InvariantCultureIgnoreCase)){
				AppendElement(result, s, GetTitleElement(xml, row[s].ToString()));
				continue;
			}
			AppendElement(result, s, row[s]);
		}
		return result;
	}

	private XmlNode GetBodyElement(XmlDocument xml, string elementData){
		string[] dataStrFragments = elementData.Split(NoticeSeparateChars.ToCharArray());
		XmlNode result = xml.CreateDocumentFragment();
		XmlElement body = xml.CreateElement("body");
		string bodyData = null;
		if(dataStrFragments.Length > 1){
			bodyData = dataStrFragments[0];
			for(int i = 1; i < dataStrFragments.Length; i++){
				string noticeTitle = dataStrFragments[i];
				if(++i >= dataStrFragments.Length) break;
				string noticeBody = dataStrFragments[i];
				XmlElement notice = xml.CreateElement("note");
				result.AppendChild(notice);
				AppendElement(notice, "noteTitle", noticeTitle);
				AppendElement(notice, "noteBody", noticeBody);
			}
		} else {
			bodyData = elementData;
		}
		if(!string.IsNullOrEmpty(bodyData)){
			body.InnerText = bodyData;
			result.PrependChild(body);
		}
		return result;
	}

	private XmlNode GetTitleElement(XmlDocument xml, string elementData){
		string data = TitleDeletePattern.Replace(elementData, "");
		XmlNode result = xml.CreateTextNode(data);
		return result;
	}

}


