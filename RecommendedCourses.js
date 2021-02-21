import React from 'react';
import './App.css';


class RecommendedCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: [],
      courses: [],
      seen : [],
    }

  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  recommender() {
    let notCompleted = this.props.notCompleted;
    let ratings = this.props.dataRating;
    let allCourses = this.props.allCourses;

    let highRated = [];

    let highRatedWords = [];
    let coursesTemp = [];


    //go through conditions to modify the return recommended courses
   
    //INITIALIZE

    //rating not selected
    if(ratings.length===0) {
      // console.log("No Rating")
      coursesTemp = notCompleted

    }

    //RATING 5 IS CONSIDERED HIGH RATING AND WILL BE WHAT TRIGGERS ON SELECTION THE RECOMMENDED COURSES TO CHANGE
    
    //check that rating has been selected before by the user

    if(ratings.length>0) {

      //check for lastest instance of the COURSE NUMBER of the rating for the course before adding the rating
      //create array of seen courses already to not add already passed courses that came earlier
      
      let seen = [];
     
      
      for(let i = ratings.length-1; i >= 0; i--) {
        // console.log("------")
        // console.log(Object.values(ratings[i]))
        // console.log(Object.values(ratings[i])[0])
        // console.log(Object.values(ratings[i])[1])

          //if rating is 5 then && check that while the loop was entering earlier rating selections it doesn't add in inaccurate ratings
          //cause we are reading backwards from latest to earlier
          //PARSE THROUGH THE KEYWORDS TO FIND THE MOST MATCHING TO BE THE COMMONALITY TO USE AS THE PUSHED HIGHRATED WORD FOR THE TOP COURSES
          //WEIGHT IS MAINLY RELATIVE TO THE LAST ADJUSTED COURSE SELECTION RATINGS INTEREST AREA KEYWORDS FOR COURSE SUGGESTIONS
          if(((Object.values(ratings[i])[0]) === "5") && (!seen.includes(String(Object.values(ratings[i])[1])))) {
            highRated.push(Object.values(ratings[i])[1]);

            // console.log("Before " + seen.includes(String(Object.values(ratings[i])[1])))

            //once we add the latest rating for course, add the course number to seen
            seen.push(Object.values(ratings[i])[1])
            
            // console.log("After " + seen.includes(String(Object.values(ratings[i])[1])))
           break;
          }
          else if(((Object.values(ratings[i])[0]) === "5") && (seen.includes(String(Object.values(ratings[i])[1])))) {
              if(!highRated.includes(Object.values(ratings[i])[1])) {
                highRated.push(Object.values(ratings[i])[1]);
              }
          }
          else{
            highRated.splice(highRated.indexOf(Object.values(ratings[i])[1]));      
            break;
          }  
        
      }
       

      //check for if there are any high rated courses in the list
      if(highRated.length > 0) {
      //take the high rated courses and loop through the all courses to get their object properties for keywords 
      for(let i = 0; i < allCourses.length; i++) {
        if(highRated.includes(allCourses[i].number)){
          // console.log("Yes")
          highRatedWords.push(allCourses[i].keywords)
        }

      }

      //  console.log(highRatedWords)

      //one array to contain all of high rated's words
      let highRatedTotal = []

       //combine arrays into one of all the words
      for(let i = 0; i < highRatedWords.length; i++) {
        for(let j = 0; j < highRatedWords[i].length; j++) {
        highRatedTotal.push(highRatedWords[i][j])
        }
      }
      //  console.log(highRatedTotal)
      
      //prune for duplicates
      let unique = highRatedTotal.filter(this.onlyUnique)

     
      let recToAdd = []
      //take the collective all highRatedWords and suggest from not completed courses with respect to their keywords
      for(let i = 0; i < notCompleted.length; i++) {
        // console.log(notCompleted[i])
        // console.log(notCompleted.length)
        let curr = notCompleted[i];
   
        //loop through high rated words key word arrays and check if that not completed course contains at least one instance of highRatedWord
        for(let j = 0; j < curr.keywords.length; j++) {
          // console.log(notCompleted[i].keywords.length)
          
          // console.log(curr.keywords[j])
          
          if(unique.includes(curr.keywords[j]) ){
              recToAdd.push(curr)
            break;
          }
          
        }
            
      }

      //console.log(recToAdd)
      coursesTemp=recToAdd 
    }
    //if there are none in highRating list then just return the whole notCompleted list
    else {
      coursesTemp=notCompleted
    }

    }
    
    return coursesTemp

  }
  
    render() {
      // let recommendedTemp = this.props.notCompleted.map((x) =><li key={x.number.toString()}>{x.number}</li>);
      // console.log(this.props.dataWord);
      // console.log(this.props.dataRating);
      // let array = Object.values(this.props.dataRating);
      
      // console.log(array[0])
      // console.log(this.props.dataWord)
      // console.log(array.label)

      
      let recommended = this.recommender().map((x) => <li key={x.number.toString()}>{x.number}</li>);

      return (
        <div style={{margin: 0, marginTop: 30}}>   
              <ul>{recommended}</ul>
        </div>
      )
    }
  }
  
  export default RecommendedCourses;
  