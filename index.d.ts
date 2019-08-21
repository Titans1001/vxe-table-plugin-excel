import VXETable from 'vxe-table'

export interface VXETablePluginStatic {
  install(xTable: typeof VXETable): void;
}

/**
 * vxe-table renderer plugins for element-ui.
 */
declare var VXETablePluginExcel: VXETablePluginStatic;

export default VXETablePluginExcel;