<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
<xsl:output
 method="xml"
 indent="yes" 
 doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
 doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
/>

<xsl:template match="/">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="robots" content="index, follow" />
<meta name="keywords" content="ウェブ,アクセシビリティ,基盤,委員会,WAIC,web,accessibility,infrastructure,committee,アクセシビリティ,サポーテッド,AS,情報" />
<meta name="description" content="アクセシビリティ サポーテッド（AS）情報に関する解説文書" />
<link rel="stylesheet" type="text/css" href="http://waic.jp/cmn/css/docs.css" />
<title>アクセシビリティ サポーテッド（AS）情報：2014年6月版 <xsl:value-of select="/AsDescription/@target" /></title>
<style type="text/css">table{empty-cells: show;}tr.warn{background: #ffd;}tr.ng{background: #fdd;}</style>
</head>
<body>
<div id="logo"><a href="http://waic.jp/"><img src="http://waic.jp/cmn/img/header/logo.png" alt="ウェブアクセシビリティ基盤委員会 / WAIC: Web Accessibility Infrastructure Committee" width="334" height="77" /></a></div>
<h1>アクセシビリティ サポーテッド（AS）情報：2019年m月版</h1>

<ul>
<li>公開日：2019年m月d日</li>
<li>作成者：ウェブアクセシビリティ基盤委員会（WAIC）</li>
<li>前のバージョン：<a href="/docs/jis2010-as-understanding/201406/">2014年6月版（2014年7月4日公開）</a></li>
</ul>

<h2>達成基準ごとの検証結果</h2>

<ul>
<xsl:for-each select="SuccessCriteria/SuccessCriteriaGroup[@level='A' or @level='AA']/item">
<xsl:sort select="id" order="ascending" />
<xsl:apply-templates select="." />
</xsl:for-each>
</ul>

</body></html>
</xsl:template>

<xsl:template match="item">
<li>
<xsl:if test="ファイル有無='True'"><a><xsl:attribute name="href"><xsl:value-of select="id"/>.html</xsl:attribute><xsl:value-of select="id"/><xsl:text> </xsl:text><xsl:value-of select="name"/></a></xsl:if>
<xsl:if test="ファイル有無='False'"><xsl:value-of select="id"/><xsl:text> </xsl:text><xsl:value-of select="name"/></xsl:if>
</li>
</xsl:template>

</xsl:stylesheet>
