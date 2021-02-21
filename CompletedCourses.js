import React from 'react';
import './App.css';
import RecommendedCourses from './RecommendedCourses';
import CourseRating from './CourseRating';

class CompletedCourses extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        rating: []
      }

    }

    ratingCallBack = (x) => {
      this.setState(prevState => ({
      rating: [...prevState.rating, x]
    }));
    }

    getCourses() {
      let courses = [];
  
      if (Array.isArray(this.props.data)){
       for(let i = 0; i < this.props.data.length; i++){
        courses.push (
          this.props.data[i]
        )
      }
    }
    else{
      for(const course of Object.values(this.props.data)){
        for(let i = 0; i < course.length; i++) {
          courses.push(course[i])
        }    
      }
    }

    return courses
    }
   
    render() {
      
      //  console.log(this.state.rating)

      let completed = this.getCourses().map(
        (x)=><li key={x.toString()}>{x}<CourseRating label={x} appRatingCallBack={this.props.appRatingCallBack(this.state.rating)} ratingsCallBack={this.ratingCallBack}/></li>
        );
      return (
        <div style={{margin: 0, marginTop: 30}}>   
            <ul>{completed}</ul>

        </div>
        
      )
    }
  }
  
  export default CompletedCourses;
  