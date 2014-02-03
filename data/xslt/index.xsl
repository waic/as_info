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
<meta name="description" content="アクセシビリティ・サポーテッド（AS）情報に関する解説文書" />
<link rel="stylesheet" type="text/css" href="http://waic.jp/cmn/css/docs.css" />
<title>アクセシビリティ・サポーテッド（AS）情報：2012年5月版 <xsl:value-of select="/AsDescription/@target" /></title>
<style type="text/css">table{empty-cells: show;}tr.warn{background: #ffd;}tr.ng{background: #fdd;}</style>
</head>
<body>
<div id="logo"><a href="http://waic.jp/"><img src="http://waic.jp/cmn/img/header/logo.png" alt="ウェブアクセシビリティ基盤委員会 / WAIC: Web Accessibility Infrastructure Committee" width="334" height="77" /></a></div>
<h1>アクセシビリティ・サポーテッド（AS）情報：2012年5月版</h1>

<ul>
<li>公開日：2012年5月15日</li>
<li>作成者：ウェブアクセシビリティ基盤委員会（WAIC）実装ワーキンググループ（WG2）</li>
</ul>

<h2><xsl:value-of select="AsDescription/@target" /><xsl:text> </xsl:text><xsl:value-of select="AsDescription/SuccessCriteria/name" /> (等級<xsl:value-of select="AsDescription/SuccessCriteria/level" />)</h2>
<xsl:for-each select="AsDescription">
<xsl:sort select="@target" order="ascending" />
<table>
<thead>
<tr>
<th scope="col">実装方法およびテスト項目</th>
<th scope="col">対象</th>
<th scope="col">達成可否</th>
</tr>
</thead>
<tbody>
<xsl:apply-templates select="item"/>
</tbody>
</table>
</xsl:for-each>

</body>
</html>
</xsl:template>


<xsl:template match="item">
<tr>
<xsl:attribute name="class">
<xsl:choose>
<xsl:when test="見解='達成可能'">ok</xsl:when>
<xsl:when test="見解='要注意'">warn</xsl:when>
<xsl:when test="見解='達成不可能'">ng</xsl:when>
</xsl:choose>
</xsl:attribute>
<td><a><xsl:attribute name="href"><xsl:value-of select="id"/>.html</xsl:attribute><xsl:value-of select="id"/>: <xsl:value-of select="実装方法タイトル"/></a></td>
<td><xsl:value-of select="対象"/></td>
<td><xsl:value-of select="見解"/></td>
</tr>
</xsl:template>



<xsl:template name="lf_to_br">
<xsl:param name="value"/>
<xsl:choose>
<xsl:when test="contains($value, '&#xA;')">
<xsl:value-of select="substring-before($value, '&#xA;')"/><br/><xsl:call-template name="lf_to_br"><xsl:with-param name="value" select="substring-after($value, '&#xA;')"/></xsl:call-template>
</xsl:when>
<xsl:otherwise>
<xsl:value-of select="$value"/>
</xsl:otherwise>
</xsl:choose>
</xsl:template>


</xsl:stylesheet>
