# 如何贡献代码

欢迎一起共建 epage

## Branch 说明

```
publish
 ↑
dev --> master
 ↑
PR
```

主要有两个分支：`dev` 及 `master`

- `dev` 分支：开发及发版均在此分支，提PR也提交到这里
- `master` 分支：稳定分支，在`dev`开发并发布后合并到`master`，然后打上tag

**说明：**

有较大新功能会以 `feat/xxx` 创建分支

## Commit 格式

```
[{keyword}]({scope}): {description}
```

- `{keyword}`
  - `revert` 撤销某些提交
  - `feat` 新增功能
  - `fix` 更新或者修复 bug
  - `docs` 文档修改更新
  - `style` 代码格式（不影响代码运行的变动）
  - `refactor` 重构（即不是新增功能，也不是修改bug的代码变动）
  - `perf` 性能优化
  - `test` 测试新增或更新
  - `chore` 构建过程或辅助工具的变动
- `{scope}`: 可选，用于说明 commit 影响的范围
- `{description}`
  - 尽可能详细的描述就好，1-50个字符

for example:

- [feat]: 新增富文本widget
- [fix]: 修复下拉框展开后点击空白不消失

