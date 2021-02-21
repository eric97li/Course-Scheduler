class SearchAndFilter {
  searchAndFilter(courses, keyWord, search, subject, minimumCredits, maximumCredits) {

  
    if(subject !== '' && search !== null) {
      let coursesAfterSearch = [];

      for(const course of courses) {
        for(const keyword of course.keywords)
        {
          if(keyword.includes(search)){
          coursesAfterSearch.push(course);
          break;
          }
        } 
      }
      courses = coursesAfterSearch;
    }

    if(keyWord !== '') {
      let coursesAfterKeyword = [];
      for(const course of courses) {
        for(const keyword of course.keywords) {
          if(keyword.includes(keyWord)) {
            coursesAfterKeyword.push(course);
            break;
          }
          //just add the course if the interest area keyword is All, no need to check
          else if(keyWord==='All'){
            coursesAfterKeyword.push(course);
            break;
          }
        }
      }
      courses = coursesAfterKeyword;
    }


    if(subject !== 'All') {
      let coursesAfterSubject = [];

      for(const course of courses) { 
        if(course.subject === subject)
          coursesAfterSubject.push(course);
      }
      courses = coursesAfterSubject;
    }

    if(minimumCredits !== '') {
      let coursesAfterMinimumCredits = [];

      for(const course of courses) { 
        if(course.credits >= parseInt(minimumCredits))
          coursesAfterMinimumCredits.push(course);
      }
      courses = coursesAfterMinimumCredits;
    }

    if(maximumCredits !== '') {
      let coursesAfterMaximumCredits = [];

      for(const course of courses) { 
        if(course.credits <= parseInt(maximumCredits))
          coursesAfterMaximumCredits.push(course);
      }
      courses = coursesAfterMaximumCredits;
    }

    return courses;
  }
}

export default SearchAndFilter;
