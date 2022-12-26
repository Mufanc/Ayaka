# Ayaka's Notes

<img src="images/150px-Ayayaka.png" align="right" alt="Ayayaka"/>

## 依赖

* [`rust`](https://www.rust-lang.org/)：Ayaka CLI 使用 Rust 语言开发
* [`cargo`](https://crates.io/)：Rust 的构建系统和包管理器
* [`node.js`](https://nodejs.org/)：用于构建 Ayaka 前端
* [`pnpm`](https://pnpm.io/)：Node.js 的软件包管理器

## 食用方法

* 🔨 从源码安装

```bash
git clone https://github.com/Mufanc/Ayaka && cd Ayaka
cargo install --path .
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

## 规范

### 文章标题

你的文章应有且仅有一个 h1 标题作为总标题，正文从 h2 标题开始使用，Ayaka 会为 h2、h3、h4 标题在右侧生成 TOC

### `<img/>` 标签

引用本地图片时，路径应以 `./` 开头，这样 Ayaka 就能在部署时将它替换成正确的地址

## 排版建议

下面的部分节选自 [中文文案排版指北](https://github.com/sparanoid/chinese-copywriting-guidelines/blob/master/README.zh-Hans.md)，建议应尽量按照此标准写作以获得最佳的展示效果

### 空格

#### 中英文之间需要增加空格

正确：

```markdown
在 LeanCloud 上，数据存储是围绕 AVObject 进行的。
```

错误：

```markdown
在LeanCloud上，数据存储是围绕AVObject进行的。
```

#### 中文与数字之间需要增加空格

正确：

```markdown
今天出去买菜花了 5000 元。
```

错误：

```markdown
今天出去买菜花了5000元。
```

#### 全角标点与其他字符之间不加空格

正确：

```markdown
刚刚买了一部 iPhone，好开心！
```

错误：

```markdown
刚刚买了一部 iPhone ，好开心！
刚刚买了一部 iPhone， 好开心！
```

### 全角和半角

#### 使用全角中文标点

正确：

```markdown
嗨！你知道嘛？今天前台的小妹跟我说「喵」了哎！

核磁共振成像（NMRI）是什么原理都不知道？JFGI！
```

错误：

```markdown
嗨! 你知道嘛? 今天前台的小妹跟我说 "喵" 了哎！

嗨!你知道嘛?今天前台的小妹跟我说"喵"了哎！

核磁共振成像 (NMRI) 是什么原理都不知道? JFGI!

核磁共振成像(NMRI)是什么原理都不知道?JFGI!
```

#### 数字使用半角字符

正确：

```markdown
这个蛋糕只卖 1000 元。
```

错误：

```markdown
这个蛋糕只卖 １０００ 元。
```

#### 遇到完整的英文整句、特殊名词，其内容使用半角标点

正确：

```markdown
推荐你阅读《Hackers & Painters: Big Ideas from the Computer Age》，非常的有趣。
```

错误：

```markdown
推荐你阅读《Hackers＆Painters：Big Ideas from the Computer Age》，非常的有趣。
```

### 名词

#### 专有名词使用正确的大小写

正确：

```markdown
使用 GitHub 登录
```

错误：

```markdown
使用 github 登录
```

#### 不要使用不地道的缩写

正确：

```markdown
我们需要一位熟悉 TypeScript、HTML5，至少理解一种框架（如 React、Next.js）的前端开发者。
```

错误：

```markdown
我们需要一位熟悉 Ts、h5，至少理解一种框架（如 RJS、nextjs）的 FED。
```

如遇单词过长确实需要缩写的情况，需要先行说明，例如：

```markdown
ActivityManagerService（以下简称 AMS）是 Android 系统中一个非常重要的服务
```
