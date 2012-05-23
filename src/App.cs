using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

public class App{

	public static int Main(string[] args){
		try{
			DirectoryInfo basedir = null;
			if(args.Length < 1){
				basedir = new DirectoryInfo("./");
			} else {
				basedir = new DirectoryInfo(args[0]);
			}
			if(!basedir.Exists){
				Console.WriteLine("Directory not found: {0}", basedir.FullName);
				return 1;
			}
			var csvLoader = new CsvLoader(basedir);
			csvLoader.Execute();

			return 0;
		} catch(Exception e){
			Console.Error.WriteLine(e);
			return 1;
		}
	}


}


