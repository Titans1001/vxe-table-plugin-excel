(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("vxe-table-plugin-excel", ["exports", "xe-utils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("xe-utils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.XEUtils);
    global.VXETablePluginExcel = mod.exports.default;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _xeUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.VXETablePluginExcel = _exports.EXCEL_METHODS_NAME = void 0;
  _xeUtils = _interopRequireDefault(_xeUtils);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var excelEditConfig = {
    trigger: 'dblclick',
    mode: 'cell',
    showIcon: false,
    showStatus: false
  };
  var excelContextMenu = {
    header: {
      options: [[{
        code: 'exportAll',
        name: '隐藏列'
      }, {
        code: 'exportAll',
        name: '取消所有隐藏'
      }]]
    },
    body: {
      options: [[{
        code: 'clip',
        name: '剪贴(Ctrl+X)'
      }, {
        code: 'copy',
        name: '复制(Ctrl+C)'
      }, {
        code: 'paste',
        name: '粘贴(Ctrl+V)'
      }], [{
        code: 'insert',
        name: '插入'
      }, {
        code: 'remove',
        name: '删除'
      }, {
        code: 'clearData',
        name: '清除内容(Del)'
      }], // [
      //   {
      //     code: 'merge',
      //     name: '合并单元格'
      //   }
      // ],
      [{
        code: 'filter',
        name: '筛选',
        children: [{
          code: 'clearFilter',
          name: '清除筛选'
        }, {
          code: 'filterSelect',
          name: '按所选单元格的值筛选'
        }]
      }, {
        code: 'sort',
        name: '排序',
        children: [{
          code: 'clearSort',
          name: '清除排序'
        }, {
          code: 'sortAsc',
          name: '升序'
        }, {
          code: 'sortDesc',
          name: '倒序'
        }]
      }], [{
        code: 'exportAll',
        name: '导出数据.csv'
      }]]
    }
  };
  var EXCEL_METHODS_NAME;
  _exports.EXCEL_METHODS_NAME = EXCEL_METHODS_NAME;

  (function (EXCEL_METHODS_NAME) {
    /* eslint-disable no-unused-vars */
    EXCEL_METHODS_NAME["CONTEXT_MENU_CLICK_EVENT"] = "contextMenuClickEvent";
    EXCEL_METHODS_NAME["CELL_SPAN_METHOD"] = "cellSpanMethod";
  })(EXCEL_METHODS_NAME || (_exports.EXCEL_METHODS_NAME = EXCEL_METHODS_NAME = {}));

  function registerComponent(_ref) {
    var _methods;

    var Vue = _ref.Vue,
        Table = _ref.Table;
    var Excel = {
      name: 'VxeExcel',
      props: {
        columns: Array
      },
      data: function data() {
        var data = {
          excelStore: {
            uploadRows: []
          },
          mergeStore: {
            colList: [],
            rowList: []
          }
        };
        return data;
      },
      computed: {
        tableProps: function tableProps() {
          var $props = this.$props,
              editConfig = this.editConfig,
              sortConfig = this.sortConfig,
              filterConfig = this.filterConfig;
          return _xeUtils["default"].assign({}, $props, {
            border: true,
            resizable: true,
            showOverflow: null,
            // spanMethod: this.cellSpanMethod,
            contextMenu: excelContextMenu,
            mouseConfig: {
              selected: true,
              range: true
            },
            keyboardConfig: {
              isArrow: true,
              isDel: true,
              isEnter: true,
              isTab: true,
              isCut: true,
              isEdit: true
            },
            editConfig: Object.assign({}, excelEditConfig, editConfig),
            sortConfig: Object.assign({
              showIcon: false
            }, sortConfig),
            filterConfig: Object.assign({
              showIcon: false
            }, filterConfig),
            optimization: {
              scrollX: {
                gt: 100
              },
              scrollY: {
                gt: 100
              }
            }
          });
        }
      },
      watch: {
        columns: function columns(value) {
          this.loadColumn(value);
        }
      },
      mounted: function mounted() {
        var columns = this.columns;

        if (columns && columns.length) {
          this.loadColumn(this.columns);
        }
      },
      render: function render(h) {
        var $slots = this.$slots,
            $listeners = this.$listeners,
            tableProps = this.tableProps;
        return h('vxe-table', {
          "class": 'vxe-excel',
          props: tableProps,
          on: _xeUtils["default"].assign({}, $listeners, {
            'context-menu-click': this.contextMenuClickEvent
          }),
          ref: 'xTable'
        }, $slots["default"]);
      },
      methods: (_methods = {}, _defineProperty(_methods, EXCEL_METHODS_NAME.CONTEXT_MENU_CLICK_EVENT, function (_ref2, evnt) {
        var menu = _ref2.menu,
            row = _ref2.row,
            column = _ref2.column;
        var $table = this.$refs.xTable;
        var property = column.property;

        switch (menu.code) {
          case 'clip':
            $table.handleCopyed(true, evnt);
            break;

          case 'copy':
            $table.handleCopyed(false, evnt);
            break;

          case 'paste':
            $table.handlePaste(evnt);
            break;

          case 'insert':
            $table.insertAt({}, row);
            break;

          case 'remove':
            $table.remove(row);
            break;

          case 'clearData':
            $table.clearData(row, property);
            break;

          case 'clearFilter':
            $table.clearFilter(column);
            break;

          case 'filterSelect':
            $table.setFilter(column, [{
              data: _xeUtils["default"].get(row, property),
              checked: true
            }]);
            $table.updateData();
            $table.clearIndexChecked();
            $table.clearHeaderChecked();
            $table.clearChecked();
            $table.clearSelected();
            $table.clearCopyed();
            break;

          case 'clearSort':
            $table.clearSort();
            break;

          case 'sortAsc':
            $table.sort(property, 'asc');
            break;

          case 'sortDesc':
            $table.sort(property, 'desc');
            break;

          case 'exportAll':
            $table.exportData({
              isHeader: false
            });
            break;

          case 'merge':
            var _ref3 = $table.getSelectedRanges ? $table.getSelectedRanges() : $table.getMouseCheckeds(),
                columns = _ref3.columns,
                rows = _ref3.rows;

            var _this$mergeStore = this.mergeStore,
                colList = _this$mergeStore.colList,
                rowList = _this$mergeStore.rowList;

            if (rows.length && columns.length) {
              rows.forEach(function (row) {
                return rowList.indexOf(row) === -1 ? rowList.push(row) : 0;
              });
              columns.forEach(function (column) {
                return colList.indexOf(column) === -1 ? colList.push(column) : 0;
              });
            }

            break;
        }
      }), _defineProperty(_methods, EXCEL_METHODS_NAME.CELL_SPAN_METHOD, function (params) {
        var row = params.row,
            $rowIndex = params.$rowIndex,
            column = params.column,
            data = params.data;
        var _this$mergeStore2 = this.mergeStore,
            colList = _this$mergeStore2.colList,
            rowList = _this$mergeStore2.rowList;

        if (colList.indexOf(column) > -1) {
          var prevRow = data[$rowIndex - 1];
          var nextRow = data[$rowIndex + 1];
          var isMerged = rowList.indexOf(row) > -1;

          if (prevRow && isMerged && rowList.indexOf(prevRow) > -1) {
            return {
              rowspan: 0,
              colspan: 0
            };
          } else {
            var countRowspan = 1;

            if (isMerged) {
              while (nextRow && rowList.indexOf(nextRow) > -1) {
                nextRow = data[++countRowspan + $rowIndex];
              }
            }

            if (countRowspan > 1) {
              return {
                rowspan: countRowspan,
                colspan: 1
              };
            }
          }
        }
      }), _methods)
    }; // 继承 Table

    _xeUtils["default"].assign(Excel.props, Table.props);

    _xeUtils["default"].each(Table.methods, function (cb, name) {
      Excel.methods[name] = function () {
        return this.$refs.xTable[name].apply(this.$refs.xTable, arguments);
      };
    });

    Vue.component(Excel.name, Excel);
  }

  var rowHeight = 24;

  function getCursorPosition(textarea) {
    var rangeData = {
      text: '',
      start: 0,
      end: 0
    };

    if (textarea.setSelectionRange) {
      rangeData.start = textarea.selectionStart;
      rangeData.end = textarea.selectionEnd;
    }

    return rangeData;
  }

  function setCursorPosition(textarea, rangeData) {
    if (textarea.setSelectionRange) {
      textarea.focus();
      textarea.setSelectionRange(rangeData.start, rangeData.end);
    }
  }
  /**
   * 渲染函数
   */


  var renderMap = {
    cell: {
      autofocus: 'textarea',
      renderEdit: function renderEdit(h, editRender, params) {
        var $table = params.$table,
            row = params.row,
            column = params.column;
        var $excel = $table.$parent;
        var excelStore = $excel.excelStore;
        var uploadRows = excelStore.uploadRows;
        var model = column.model;
        return [h('div', {
          "class": 'vxe-textarea vxe-excel-cell',
          style: {
            height: "".concat(column.renderHeight, "px")
          }
        }, [h('textarea', {
          "class": 'vxe-textarea--inner',
          style: {
            width: "".concat(column.renderWidth, "px")
          },
          domProps: {
            value: model.value
          },
          on: {
            input: function input(evnt) {
              var inpElem = evnt.target;
              model.update = true;
              model.value = inpElem.value;

              if (inpElem.scrollHeight > inpElem.offsetHeight) {
                if (uploadRows.indexOf(row) === -1) {
                  inpElem.style.width = "".concat(inpElem.offsetWidth + 20, "px");
                } else {
                  inpElem.style.height = "".concat(inpElem.scrollHeight, "px");
                }
              }
            },
            change: function change(evnt) {
              if (uploadRows.indexOf(row) === -1) {
                uploadRows.push(row);
              }
            },
            keydown: function keydown(evnt) {
              var inpElem = evnt.target;

              if (evnt.altKey && evnt.keyCode === 13) {
                evnt.preventDefault();
                evnt.stopPropagation();
                var rangeData = getCursorPosition(inpElem);
                var pos = rangeData.end;
                var cellValue = inpElem.value;
                cellValue = "".concat(cellValue.slice(0, pos), "\n").concat(cellValue.slice(pos, cellValue.length));
                inpElem.value = cellValue;
                model.update = true;
                model.value = cellValue;
                inpElem.style.height = "".concat((Math.floor(inpElem.offsetHeight / rowHeight) + 1) * rowHeight, "px");
                setTimeout(function () {
                  rangeData.start = rangeData.end = ++pos;
                  setCursorPosition(inpElem, rangeData);
                });
              }
            }
          }
        })])];
      },
      renderCell: function renderCell(h, editRender, params) {
        var row = params.row,
            column = params.column;
        return [h('span', {
          domProps: {
            innerHTML: _xeUtils["default"].escape(_xeUtils["default"].get(row, column.property)).replace(/\n/g, '<br>')
          }
        })];
      }
    }
  };
  /**
   * 基于 vxe-table 表格的增强插件，实现简单的 EXCEL 表格
   */

  var VXETablePluginExcel = {
    install: function install(xtable) {
      var renderer = xtable.renderer,
          v = xtable.v;

      if (v !== 'v2') {
        throw new Error('[vxe-table-plugin-excel] V2 version is required.');
      } // 添加到渲染器


      renderer.mixin(renderMap); // 注册组件

      registerComponent(xtable);
    }
  };
  _exports.VXETablePluginExcel = VXETablePluginExcel;

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(VXETablePluginExcel);
  }

  var _default = VXETablePluginExcel;
  _exports["default"] = _default;
});