import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import CompletedCourses from './CompletedCourses';
import RecommendedCourses from './RecommendedCourses';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      cartCourses: {},

      completedCourses: [],
      rating: [],
      keyWord: ""
    };
    this.ratingCallBack = this.ratingCallBack.bind(this)
    this.getKeyWord = this.getKeyWord.bind(this)
  }



  componentDidMount() {
   this.loadInitialState()
  }

  async loadInitialState(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json()

    let completedURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let completedData = await (await fetch(completedURL)).json()

    this.setState({allCourses: courseData, filteredCourses: courseData, subjects: this.getSubjects(courseData), completedCourses: completedData});
    
    //  console.log(this.state.allCourses[0].number)
    // console.log(this.state.allCourses[0].number)
      // console.log(this.state.completedCourses.data[0])
  }

  notCompletedCourses() {
    //allCourses-completedCourses
    let totalClasses = this.state.allCourses;
    let totalCompleted = this.state.completedCourses.data;
    let notCompleted = [];

   
    for(let i = 0; i < totalClasses.length; i++) {
      if(!totalCompleted.includes(totalClasses[i].number)) {
        notCompleted.push(totalClasses[i])
      }
    }

    return notCompleted
  }

  getKeyWord(x) {
     this.setState({keyWord: x})
   
  }

   ratingCallBack(y) {
    //stop this method from updating unecessarily on the rating
    let a = this.state.rating
    if(!(Array.isArray(a) && Array.isArray(y) && a.length === y.length && a.every((val, index) => val === y[index]))) {
      this.setState({rating: y});
    }
    
   }


  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(let i = 0; i < data.length; i++) {
      if(subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
    if (courseIndex === -1)
    {
      return 
    }

    if('subsection' in data) {
      if(data.course in this.state.cartCourses) {
        if(data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if('section' in data) {
      if(data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      
      
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) { 
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
        newCartCourses[data.course][i] = [];

         for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }


    }
    this.setState({cartCourses: newCartCourses});
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if(newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if('section' in data) {
      delete newCartCourses[data.course][data.section];
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({cartCourses: newCartCourses});
  }

  getCartData() {
    let cartData = [];

    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})

      cartData.push(course);
    }
    return cartData;
  }

  keyWords() {

    let keyWordsArrays = [];
    let keyWords = [];
    let courses = this.state.allCourses;
    for(let i = 0; i<courses.length; i++) {
      keyWordsArrays.push(this.state.allCourses[i].keywords)
    }
    //push first entry of keyword array as All to get all areas option
    keyWords.push("All");
    for(const wordSet of keyWordsArrays){
      for(let i = 0; i<wordSet.length; i++) {
        if(!keyWords.includes(wordSet[i])){
          keyWords.push(wordSet[i])
        }  
      }
    }
    return keyWords
  }

  render() {

    //  console.log(this.notCompletedCourses());
    // console.log(this.state.completedCourses);
    //  console.log(this.state.allCourses);
      // console.log(this.state.keyWord)
      // console.log(this.state.rating);

    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects} keyWords={this.keyWords()} keyWordCallBack={this.getKeyWord}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.filteredCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} completedCourses={this.state.completedCourses}/>
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.getCartData()} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses} completedCourses={this.state.completedCourses}/>
            </div>
          </Tab>
          <Tab eventKey="completed" title="Completed Courses" style={{paddingTop: '5vh'}}>
          <div style={{marginLeft: '20vw'}}>
              <CompletedCourses data={this.state.completedCourses} appRatingCallBack={this.ratingCallBack}/>
          </div>
          </Tab>
          <Tab eventKey="recommended" title="Recommended Courses" style={{paddingTop: '5vh'}}>
          <div style={{marginLeft: '20vw'}}>
              <RecommendedCourses notCompleted={this.notCompletedCourses()} dataRating={this.state.rating} dataWord={this.state.keyWord} allCourses={this.state.allCourses}/>
          </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;
