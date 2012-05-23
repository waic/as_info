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
<title>アクセシビリティ・サポーテッド（AS）情報：<xsl:value-of select="description/id" /></title>
<style type="text/css">table{empty-cells: show;}</style>
</head>
<body>
<div id="logo"><a href="http://waic.jp/"><img src="http://waic.jp/cmn/img/header/logo.png" alt="ウェブアクセシビリティ基盤委員会 / WAIC: Web Accessibility Infrastructure Committee" width="334" height="77" /></a></div>
<h1>アクセシビリティ・サポーテッド（AS）情報：<xsl:value-of select="description/id" /></h1>

<ul>
<li>公開日：2012年5月15日</li>
<li>作成者：ウェブアクセシビリティ基盤委員会（WAIC）実装ワーキンググループ（WG2）</li>
</ul>

<xsl:apply-templates/>

</body>
</html>
</xsl:template>



<xsl:template match="/description">
<h2><xsl:value-of select="id"/>: <xsl:value-of select="実装方法タイトル"/></h2>

<h3>関連する達成基準の実装方法一覧</h3>
<xsl:for-each select="SuccessCriteria">
<p><a><xsl:attribute name="href"><xsl:value-of select="number"/>.html</xsl:attribute>
<xsl:value-of select="number"/> <xsl:value-of select="name"/> (等級<xsl:value-of select="level"/>)</a></p>
</xsl:for-each>

<h3>テストファイル</h3>
<p><a><xsl:attribute name="href">
http://waic.jp/docs/jis2010-as-tests/201008/<xsl:value-of select="SuccessCriteria/level"/>/<xsl:value-of select="testType"/>/<xsl:value-of select="id"/>.html</xsl:attribute>
<xsl:value-of select="id"/>のテストファイル</a></p>

<div>
<xsl:attribute name="class">
<xsl:choose>
<xsl:when test="見解='達成可能'">ok</xsl:when>
<xsl:when test="見解='要注意'">warn</xsl:when>
<xsl:when test="見解='達成不可能'">ng</xsl:when>
</xsl:choose>
</xsl:attribute>
<h3>見解</h3>
<p><xsl:value-of select="見解"/></p>
</div>

<h3>対象</h3>
<p><xsl:value-of select="対象"/></p>

<xsl:if test="注意点">
<h3>注意点</h3>
<xsl:apply-templates select="注意点/body"/>
<xsl:apply-templates select="注意点/note"/>
</xsl:if>

<xsl:if test="代替もしくは推奨する方法">
<h3>代替もしくは推奨する方法</h3>
<xsl:apply-templates select="代替もしくは推奨する方法/body"/>
<xsl:apply-templates select="代替もしくは推奨する方法/note"/>
</xsl:if>

<xsl:if test="備考">
<h3>備考</h3>
<p><xsl:call-template name="lf_to_br"><xsl:with-param name="value" select="備考"/></xsl:call-template></p>
</xsl:if>

<h3>テスト結果の詳細</h3>
<xsl:apply-templates select="testDetail"/>

</xsl:template>


<xsl:template match="testDetail">
<table>
<thead>
<tr>
<th scope="col">ユーザエージェント</th>
<th scope="col">検証結果</th>
<th scope="col">操作手順</th>
<th scope="col">備考</th>
</tr>
</thead>
<tbody>
<xsl:for-each select="result">
<tr>
<xsl:attribute name="class">
<xsl:choose>
<xsl:when test="検証結果='△'">warn</xsl:when>
<xsl:when test="検証結果='×'">ng</xsl:when>
<xsl:otherwise>ok</xsl:otherwise>
</xsl:choose>
</xsl:attribute>
<td><xsl:value-of select="@useragent"/></td>
<td><xsl:value-of select="検証結果"/></td>
<td><xsl:call-template name="lf_to_br"><xsl:with-param name="value" select="操作手順"/></xsl:call-template></td>
<td><xsl:call-template name="lf_to_br"><xsl:with-param name="value" select="備考"/></xsl:call-template></td>
</tr>
</xsl:for-each>
</tbody>
</table>
</xsl:template>




<xsl:template match="body">
<xsl:if test=".!=''">
<p><xsl:call-template name="lf_to_br"><xsl:with-param name="value" select="."/></xsl:call-template></p>
</xsl:if>
</xsl:template>

<xsl:template match="note">
<xsl:for-each select=".">
<p class="note">※<xsl:value-of select="noteTitle"/>: <xsl:call-template name="lf_to_br"><xsl:with-param name="value" select="noteBody"/></xsl:call-template></p>
</xsl:for-each>
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
