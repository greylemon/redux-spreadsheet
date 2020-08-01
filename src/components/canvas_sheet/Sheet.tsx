import React, { FunctionComponent } from 'react'
import { Stage, Layer } from 'react-konva'
import AutoSizer from 'react-virtualized-auto-sizer'
import { shallowEqual } from 'react-redux'
import STYLE_SHEET from '../sheet/style'
import { useTypedSelector } from '../../redux/redux'
import {
  selectActiveResults,
  selectData,
} from '../../redux/selectors/activeSheet'
import {
  selectTableColumnCount,
  selectTableRowCount,
  selectGetColumnWidth,
  selectGetRowHeight,
  selectTableFreezeRowCount,
  selectTableFreezeColumnCount,
  selectColumnWidthsAdjusted,
  selectCellLayering,
  selectRowOffsets,
  selectColumnOffsets,
} from '../../redux/selectors/custom'
import TopLeftPane from './TopLeftPane'

const CanvasSheet: FunctionComponent = () => {
  const {
    sheetResults,
    tableColumnCount,
    tableRowCount,
    data,
    getColumnWidth,
    getRowHeight,
    tableFreezeColumnCount,
    tableFreezeRowCount,
    columnWidthsAdjusted,
    cellLayering,
    rowOffsets,
    columnOffsets,
  } = useTypedSelector(
    (state) => ({
      sheetResults: selectActiveResults(state),
      tableColumnCount: selectTableColumnCount(state),
      tableRowCount: selectTableRowCount(state),
      data: selectData(state),
      getColumnWidth: selectGetColumnWidth(state),
      getRowHeight: selectGetRowHeight(state),
      tableFreezeRowCount: selectTableFreezeRowCount(state),
      tableFreezeColumnCount: selectTableFreezeColumnCount(state),
      columnWidthsAdjusted: selectColumnWidthsAdjusted(state),
      cellLayering: selectCellLayering(state),
      rowOffsets: selectRowOffsets(state),
      columnOffsets: selectColumnOffsets(state),
    }),
    shallowEqual
  )

  return (
    <div style={STYLE_SHEET}>
      <AutoSizer>
        {({ height, width }) => (
          <div style={{ height, width }}>
            <Stage
              height={rowOffsets[tableRowCount]}
              width={columnOffsets[tableColumnCount]}
            >
              <Layer
                height={rowOffsets[tableFreezeRowCount + 1]}
                width={columnOffsets[tableFreezeColumnCount + 1]}
                clipX={0}
                clipY={0}
                style={{ position: 'sticky' }}
              >
                <TopLeftPane
                  tableFreezeColumnCount={tableFreezeColumnCount}
                  tableFreezeRowCount={tableFreezeRowCount}
                  tableRowCount={tableRowCount}
                  tableColumnCount={tableColumnCount}
                  rowOffsets={rowOffsets}
                  columnOffsets={columnOffsets}
                  getColumnWidth={getColumnWidth}
                  getRowHeight={getRowHeight}
                />
              </Layer>
            </Stage>
          </div>
        )}
      </AutoSizer>
    </div>
  )
}

export default CanvasSheet
