# 概念

## 工作区(working dir)

可以理解为看到的本机的目录就是工作区

## commit

一个 18 位加密串

## 索引(Index)

当执行 `git add <pathspec>`后，相当于将工作区中的修改同步到了一个不可见的目录，该目录就叫 `Index`。执行`git add .`后即工作区与索引区完全相同.

## HEAD

指针，指向一个 commit。通常是指向当前分支最新的 commit 节点。

## 分支

本地.git 目录中有本地仓库和远程仓库。一般远程仓库为 origin/branchName。

# 使用命令

## git add

-A 同 "."参数，将 working dir 中的所有更新添加到索引区.

## commit

-   [ -m 'message' ]

为一个 commit 写提交信息

-   [ --amend ]
    修订 commit

任务该改动属于上个 commit 的改动，可以执行 git add 后，再执行 git commit --amend , 意味着把当前的改动合并入 HEAD 的 commit,不新建 commit，但是修改当前 commit 的值。回车后，会调起文本编辑器，提示输入修改后的 commit message,从而达到不新建 commit 的效果。

-   [ --no-edit ]

不修改 commit 信息.

常和--amend 搭配使用:

```
git add .

git commit --amend --no-edit

```

表示当前 commit 的内容并入 HEAD 的 commit，并且使用 HEAD 的 message（不调起文本编辑器）.

使用情况：

在一次 commit 之后，发现还有需要修改的内容，于是又进行了一次 add&commit,此时就可以使用该命令。

## git fetch

git fetch [remote] [branchname]

只会更新本地远程仓库内容，不会影响本地仓库内容

## git pull

会拉取远端的分支代码，更新本地远程仓库代码，并将当前所在分支追踪的远程分支 merge 到当前本地分支。

加-r 参数后会启用 rebase

## git branch

默认列出本地仓库所有分支

-   [-a] 展示本地仓库和本地远程库所有分支
-   [-r] 展示本地远程库所有分支
-   [-d branchName] 删除分支,-D 强制删除

## git push

-   [ -d branchName ] 删除远程分支
-   [ --tags ] 推送本地所有 tag 到远程
-   [ origin branchName ] 推送本地仓库内容到远程

## git tag

-   [ 不加参数 ] 会列出本地所有 tag，和 git tag -l 的效果是一样的
-   [-a -m msg tagname ] -a 当添加该参数时，就需要写 message。如果不写-m 参数，就会调起编辑器提示输入 message。所以当添加一个 tag 时，直接执行 git tag tagname 就可。或者 git tag -m message tagname
-   [ -m msg ] 加该参数时，就需添加 msg 信息
-   [ -d ]git tag -d tagname 删除某个 tag

# git reset

-   [ --soft ] 移动 HEAD 到目标 commit,结果就是 Index 中内容与 HEAD 内容不同,git status 执行后显示有内容待 commit（绿色）
-   [ --mixed ] 用 HEAD 内容替换 Index 内容, 果就是 Index 中内容与 HEAD 内容相同。与工作区不同 git status 执行后显示有内容待 add（红色）
-   [ -- hard] 用 HEAD 内容替换 Index 和工作区内容,结果就是 Index 中内容与 HEAD 内容和工作区内容都相同,git status 执行后显示没有内容待 add 和待 commit

## git log

## git reflog

## git rebase

## git cherry-pick

## git revert

## git bisect 二分法,快速定位疑难 Bug

用法: `git bisect start [最近的出错的 commitid] [较远的正确的 commitid]`, 执行结果是会切换到一个新的 commit,测试功能,当功能没有问题时，`git bisect good` 标记正确，当有问题时，`git bisect bad`标记错误,最终提示的 commitid 就是导致问题的那次提交.
