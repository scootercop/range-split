import React from 'react';
import { RangeSplitContainerComponent, IOutputPropsInterface } from './RangeSplitContainerComponent';
import './App.css';
import { DataInputComponent } from "./DataInputComponent";
import { RangeInputComponent } from './RangeInputComponent';

function App() {
  return (
    <div className="App">
      <RangeSplitContainerComponent init='T1-T3,T5-T10' customErrors={false}
        rows={5} >
        {(props: IOutputPropsInterface) => {
          const { dataUpdateCallback, addRow, inputParser, dataState, errors, originalInput, countStore, dataChangeHandler, customErrors } = props;
          return <div className="container">
            <label>Input: </label>
            <DataInputComponent inputParser={inputParser} errors={errors} customErrors={customErrors} />
            <div>Used: {countStore.used} Unused: {countStore.unUsed} </div>
            <div>
              <label>Current Input: </label>
              <strong>
                {originalInput}
              </strong>
            </div>
            <table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Rating</th>
                  <th>Assignment</th>
                </tr>
                {dataState.map((rowSet, rowIndex) =>
                  <tr key={rowIndex}>
                    <td> Test Name {rowIndex + 1} </td>
                    <td> Test Dept {rowIndex + 1} </td>
                    <td> {rowIndex + 1} </td>
                    <td>
                      {rowSet.map((row, rangeIndex) =>
                        <div>
                          <RangeInputComponent
                            key={rowIndex + "-" + rangeIndex}
                            dataUpdateCallback={dataUpdateCallback}
                            dataChangeHandler={dataChangeHandler}
                            rowIndex={rowIndex}
                            rangeIndex={rangeIndex}
                            rowData={row}
                            customErrors={customErrors}
                          />
                          <button onClick={() => addRow(rowIndex)}>+</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        }}
      </RangeSplitContainerComponent>
    </div>
  );
}

export default App;
