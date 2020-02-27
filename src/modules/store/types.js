
/**
 * @type {Object} mutation type 全局唯一
 */
const types = {}
const list = [
  // 更新设计模式当前tab
  '$TAB_UPDATE',
  // 更新可用widgets
  '$WIDGETS_SET',
  // 设置全局schema，
  '$ROOT_SCHEMA_SET',
  // 拍平root schema
  '$ROOT_SCHEMA_FLAT',
  // 用户数据设置，kv形式的对象
  '$MODEL_SET',
  // 切换表单展示模式
  '$MODE_CHANGE',

  // 添加逻辑，值逻辑或事件逻辑
  '$LOGIC_ADD',
  // 更新逻辑
  '$LOGIC_UPDATE',
  // 删除逻辑
  '$LOGIC_DELETE',

  // 规则初始化
  '$RULE_INIT',
  // 更新widget规则类型
  '$RULE_TYPE_UPDATE',
  // 是否必填规则更新
  '$RULE_REQUIRED_RULE_UPDATE',
  // 更新widget规则错误消息
  '$RULE_MESSAGE_UPDATE',
  // 添加widget规则
  '$RULE_ADD',
  // 删除widget规则
  '$RULE_REMOVE',

  // 通过值逻辑关系触发的widget属性改变
  '$WIDGET_UPDATE_BY_VALUE_LOGIC',
  // 通过事件逻辑关系触发的widget属性改变
  '$WIDGET_UPDATE_BY_EVENT_LOGIC',
  // 添加widget
  '$WIDGET_ADD',
  // 删除widget
  '$WIDGET_REMOVE',
  // 用户动态添加widget
  '$WIDGET_DYNAMIC_ADD',
  // 用户动态移除widget
  '$WIDGET_DYNAMIC_REMOVE',
  // 复制widget
  '$WIDGET_COPY',
  // 更改widget值类型
  '$WIDGET_TYPE_UPDATE',
  // 设置选中widget option
  '$WIDGET_OPTION_UPDATE',
  // 选中widget
  '$WIDGET_SELECT',
  // 取消选中widget
  '$WIDGET_DESELECT',

  // 容器widget添加子容器
  '$WIDGET_CHILD_ADD',
  // 容器widget删除子容器
  '$WIDGET_CHILD_REMOVE',
  // 容器widget移动子容器
  '$WIDGET_CHILD_MOVE'
]

list.forEach(i => (types[i] = i))

export default types
