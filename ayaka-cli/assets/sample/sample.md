<!--
uuid = "{{uuid}}"
article_name = "Ayaka's Notes"
date = "{{date}}"
description = "一个简单演示｜A simple demo for Ayaka"
%-->

# Ayaka's Notes

<img src="./150px-Ayayaka.png" align="right" alt="Ayayaka"/>

## 依赖

* [`rust`](https://www.rust-lang.org/)：Ayaka CLI 使用 Rust 语言开发
* [`cargo`](https://crates.io/)：Rust 的构建系统和包管理器
* [`node.js`](https://nodejs.org/)：用于构建 Ayaka 前端
* [`pnpm`](https://pnpm.io/)：Node.js 的软件包管理器

## 食用方法

* 🔨 从源码安装

```bash
git clone https://github.com/Mufanc/Ayaka && cd Ayaka
make install
```

* 🎉 在空文件夹中初始化 Ayaka 

```bash
mkdir my-motes && cd my-notes
ayaka init
```

* 🆕 创建新文章 

```bash
ayaka new <NAME>
```

* 🚀 生成单页应用（SPA）

```bash
ayaka gen
```
