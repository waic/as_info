using System;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Xml;

public class AsTestIdListTable{

// テストのID一覧を格納するテーブル / 検証結果一覧の生成に使用

	public string[] Lines{get; private set;}
	private static Encoding Sjis = Encoding.GetEncoding("Shift_JIS");

	public AsTestIdListTable(FileInfo file){
		Load(file);
	}


	public void Load(FileInfo file){
		if(!file.Exists) return;
		string fileData = null;
		using(FileStream fs = file.Open(FileMode.Open, FileAccess.Read, FileShare.Read))
		using(StreamReader sr = new StreamReader(fs, Sjis)){
			fileData = sr.ReadToEnd();
		}
		if(string.IsNullOrEmpty(fileData)) return;
		Lines = fileData.Split(new string[]{"\x0d\x0a", "\x0a", "\x0d"}, StringSplitOptions.RemoveEmptyEntries);
	}


}


