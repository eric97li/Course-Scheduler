import React from 'react'
import { render } from 'react-dom';
import Select from 'react-select'
import './App.css';

class CourseRating extends React.Component {
    constructor() {
        super()
        this.state = {
            rating: "No Rating",
        };        
    }

    render() {
        //this.props.label
        const options = [
            {label: 'No Rating', value: this.props.label},
            {label: '0', value: this.props.label},
            {label: '1', value: this.props.label},
            {label: '2', value: this.props.label},
            {label: '3', value: this.props.label},
            {label: '4', value: this.props.label},
            {label: '5', value: this.props.label}
        ]

        return <div>
            <Select className="dropdown" options={options} onChange={this.props.ratingsCallBack} defaultValue={{ label: "No Rating", value: 'none' }}/>
                </div>
    }

}

export default CourseRating;