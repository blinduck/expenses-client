import React, {Component} from 'react';

// Single Select Pill
// expects props to have pills, keyField and onChange
const Pills = (props) => {
  return  (
      <section className="pills">
      { props.pills.map(pill => {
        return (
            <span
                key={pill[props.keyField]}
                className={pill.selected ? 'pill selected': 'pill'}
                onClick={props.onChange.bind(this, pill)}>
              {pill.verbose}
            </span>
        )
      })}
    </section>
  )
}

export default Pills