"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { account } from "../appwrite";
import { getUserSkills } from "../services/users";
import SkillHub from "../components/SkillHub";

const SkillHubPage = () => {
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<{ name: string; link: string; category: string; image: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const user = await account.get();
        if (user) {
          const skills = await getUserSkills(user.$id);
          console.log("Fetched skills:", skills); // Debugging
          setUserSkills(skills || []);
        }
      } catch (error) {
        console.error("Error fetching user skills:", error);
        setUserSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    const dynamicRecommendations = [

            
      { name: "HTML Crash Course", link: "https://www.youtube.com/watch?v=UB1O30fR-EE", category: "Videos", skills: ["HTML"], image: "../assets/html_crash.jpg" },
      { name: "Learn HTML in 30 Minutes", link: "https://www.youtube.com/watch?v=Qso8JQxCKW4", category: "Videos", skills: ["HTML"], image: "../assets/learn_html_30.jpg" },
      { name: "HTML Documentation", link: "https://developer.mozilla.org/en-US/docs/Web/HTML", category: "Articles", skills: ["HTML"], image: "../assets/html_docs.jpg" },
      { name: "HTML5 Introduction", link: "https://www.w3schools.com/html/html_intro.asp", category: "Articles", skills: ["HTML"], image: "../assets/html5_intro.jpg" },
      { name: "HTML & CSS: Design and Build Websites", link: "https://www.oreilly.com/library/view/html-css-design/9781118008188/", category: "Books", skills: ["HTML"], image: "../assets/html_css_design.jpg" },
      { name: "Learning Web Design", link: "https://www.oreilly.com/library/view/learning-web-design/9781449324966/", category: "Books", skills: ["HTML"], image: "../assets/learning_web_design.jpg" },
      
      
      { name: "JavaScript Crash Course", link: "https://www.youtube.com/watch?v=hdI2bqOjy3c", category: "Videos", skills: ["JavaScript"], image: "../assets/javascript_crash.jpg" },
      { name: "JavaScript Tutorial for Beginners", link: "https://www.youtube.com/watch?v=W6NZfCO5SIk", category: "Videos", skills: ["JavaScript"], image: "../assets/javascript_tutorial.jpg" },
      { name: "JavaScript Basics", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", category: "Articles", skills: ["JavaScript"], image: "../assets/javascript.jpg" },
      { name: "Understanding JavaScript Promises", link: "https://web.dev/promises/", category: "Articles", skills: ["JavaScript"], image: "../assets/js_promises.jpg" },
      { name: "Eloquent JavaScript", link: "https://eloquentjavascript.net/", category: "Books", skills: ["JavaScript"], image: "../assets/eloquent_javascript.jpg" },
      { name: "You Don’t Know JS", link: "https://github.com/getify/You-Dont-Know-JS", category: "Books", skills: ["JavaScript"], image: "../assets/you_dont_know_js.jpg" },



      { name: "Flexbox Froggy", link: "https://flexboxfroggy.com/", category: "Videos", skills: ["CSS"], image: "../assets/flexbox_froggy.jpg" },
      { name: "CSS Grid Layout", link: "https://www.youtube.com/watch?v=7kVeCqQCxlk", category: "Videos", skills: ["CSS"], image: "../assets/css_grid.jpg" },
      { name: "CSS Tricks", link: "https://css-tricks.com/", category: "Articles", skills: ["CSS"], image: "../assets/css.jpg" },
      { name: "CSS Flexbox Guide", link: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", category: "Articles", skills: ["CSS"], image: "../assets/flexbox_guide.jpg" },
      { name: "CSS: The Definitive Guide", link: "https://www.oreilly.com/library/view/css-the-definitive/9781491918050/", category: "Books", skills: ["CSS"], image: "../assets/css_definitive.jpg" },
      { name: "Transcending CSS", link: "https://abookapart.com/products/transcending-css", category: "Books", skills: ["CSS"], image: "../assets/transcending_css.jpg" },



      { name: "React JS Crash Course", link: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", category: "Videos", skills: ["React"], image: "../assets/react_crash_course.jpg" },
      { name: "React Tutorial for Beginners", link: "https://www.youtube.com/watch?v=Ke90Tje7VS0", category: "Videos", skills: ["React"], image: "../assets/react_tutorial.jpg" },
      { name: "React Docs", link: "https://react.dev/", category: "Articles", skills: ["React"], image: "../assets/react.jpg" },
      { name: "The Road to React", link: "https://www.roadrunner.dev/react", category: "Articles", skills: ["React"], image: "../assets/road_to_react.jpg" },
      { name: "Learning React", link: "https://www.oreilly.com/library/view/learning-react/9781492051717/", category: "Books", skills: ["React"], image: "../assets/learning_react.jpg" },
      { name: "Fullstack React", link: "https://www.fullstackreact.com/", category: "Books", skills: ["React"], image: "../assets/fullstack_react.jpg" },



      { name: "Next.js Crash Course", link: "https://www.youtube.com/watch?v=1WmNXEVia8I", category: "Videos", skills: ["Next.js"], image: "../assets/nextjs_crash_course.jpg" },
      { name: "Next.js Full Course", link: "https://www.youtube.com/watch?v=F5mRW0jo-U4", category: "Videos", skills: ["Next.js"], image: "../assets/nextjs_full_course.jpg" },
      { name: "Next.js Docs", link: "https://nextjs.org/docs", category: "Articles", skills: ["Next.js"], image: "../assets/nextjs_docs.jpg" },
      { name: "Learn Next.js", link: "https://learnnextjs.com/", category: "Articles", skills: ["Next.js"], image: "../assets/learn_nextjs.jpg" },
      { name: "The Next.js Handbook", link: "https://flaviocopes.com/page/nextjs-handbook/", category: "Books", skills: ["Next.js"], image: "../assets/nextjs_handbook.jpg" },
      { name: "Fullstack Next.js", link: "https://www.fullstackopen.com/en/nextjs", category: "Books", skills: ["Next.js"], image: "../assets/fullstack_nextjs.jpg" },
      


      { name: "Node.js Crash Course", link: "https://www.youtube.com/watch?v=fBNz5xF-Kx4", category: "Videos", skills: ["Node.js"], image: "../assets/nodejs.jpg" },
      { name: "Node.js Tutorial for Beginners", link: "https://www.youtube.com/watch?v=TlB_eWDSMt4", category: "Videos", skills: ["Node.js"], image: "../assets/nodejs_tutorial.jpg" },
      { name: "The Node.js Handbook", link: "https://flaviocopes.com/nodejs/", category: "Articles", skills: ["Node.js"], image: "../assets/nodejs_handbook.jpg" },
      { name: "Node.js Guide", link: "https://nodejs.dev/en-learn/", category: "Articles", skills: ["Node.js"], image: "../assets/nodejs_guide.jpg" },
      { name: "Node.js Design Patterns", link: "https://www.oreilly.com/library/view/nodejs-design-patterns/9781783287314/", category: "Books", skills: ["Node.js"], image: "../assets/nodejs_patterns.jpg" },
      { name: "Learning Node.js Development", link: "https://www.packtpub.com/product/learning-node-js-development/9781788621756", category: "Books", skills: ["Node.js"], image: "../assets/learning_nodejs.jpg" },
      


      { name: "Python Crash Course", link: "https://www.youtube.com/watch?v=rfscVS0vtbw", category: "Videos", skills: ["Python"], image: "../assets/python.jpg" },
      { name: "Python Tutorial for Beginners", link: "https://www.youtube.com/watch?v=YYXdXT2l-Gg", category: "Videos", skills: ["Python"], image: "../assets/python_video_tutorial.jpg" },
      { name: "Python for Beginners", link: "https://docs.python.org/3/tutorial/", category: "Articles", skills: ["Python"], image: "../assets/python_beginner_article.jpg" },
      { name: "Learn Python", link: "https://www.learnpython.org/", category: "Articles", skills: ["Python"], image: "../assets/python_tutorial_article.jpg" },
      { name: "Automate the Boring Stuff with Python", link: "https://automatetheboringstuff.com/", category: "Books", skills: ["Python"], image: "../assets/python_automate.jpg" },
      { name: "Fluent Python", link: "https://www.oreilly.com/library/view/fluent-python/9781491946237/", category: "Books", skills: ["Python"], image: "../assets/fluent_python.jpg" },

      
      { name: "TypeScript Crash Course", link: "https://www.youtube.com/watch?v=BwuLxPH8IDs", category: "Videos", skills: ["TypeScript"], image: "../assets/typescript_crash.jpg" },
      { name: "TypeScript for Beginners", link: "https://www.youtube.com/watch?v=ahCwqrYpIuM", category: "Videos", skills: ["TypeScript"], image: "../assets/typescript_for_beginners.jpg" },
      { name: "TypeScript Documentation", link: "https://www.typescriptlang.org/docs/", category: "Articles", skills: ["TypeScript"], image: "../assets/typescript_docs.jpg" },
      { name: "Understanding TypeScript", link: "https://www.tutorialspoint.com/typescript/index.htm", category: "Articles", skills: ["TypeScript"], image: "../assets/understanding_typescript.jpg" },
      { name: "Mastering TypeScript", link: "https://www.oreilly.com/library/view/mastering-typescript/9781788621755/", category: "Books", skills: ["TypeScript"], image: "../assets/mastering_typescript.jpg" },
      { name: "Pro TypeScript", link: "https://www.apress.com/gp/book/9781484249273", category: "Books", skills: ["TypeScript"], image: "../assets/pro_typescript.jpg" },
      
      
      { name: "Ruby Crash Course", link: "https://www.youtube.com/watch?v=t_ispmWmdjY", category: "Videos", skills: ["Ruby"], image: "../assets/ruby_crash.jpg" },
      { name: "Learn Ruby in 30 Minutes", link: "https://www.youtube.com/watch?v=fQrrtVxFj6s", category: "Videos", skills: ["Ruby"], image: "../assets/ruby_in_30.jpg" },
      { name: "Ruby on Rails Guide", link: "https://guides.ruby-lang.org/en/", category: "Articles", skills: ["Ruby"], image: "../assets/ruby_on_rails_guide.jpg" },
      { name: "Ruby Documentation", link: "https://www.ruby-lang.org/en/documentation/", category: "Articles", skills: ["Ruby"], image: "../assets/ruby_docs.jpg" },
      { name: "Programming Ruby", link: "https://pragprog.com/titles/ruby3/programming-ruby-3-0/", category: "Books", skills: ["Ruby"], image: "../assets/programming_ruby.jpg" },
      { name: "The Ruby Way", link: "https://www.oreilly.com/library/view/ruby-way/9780132113477/", category: "Books", skills: ["Ruby"], image: "../assets/the_ruby_way.jpg" },
      
      
      { name: "Go Programming Tutorial", link: "https://www.youtube.com/watch?v=YS4e4q9oJ6A", category: "Videos", skills: ["Go"], image: "../assets/go_programming.jpg" },
      { name: "Learn Go - Golang Tutorial", link: "https://www.youtube.com/watch?v=GVd9j_xxPQQ", category: "Videos", skills: ["Go"], image: "../assets/learn_go.jpg" },
      { name: "Go Documentation", link: "https://golang.org/doc/", category: "Articles", skills: ["Go"], image: "../assets/go_docs.jpg" },
      { name: "Go Wiki", link: "https://github.com/golang/go/wiki", category: "Articles", skills: ["Go"], image: "../assets/go_wiki.jpg" },
      { name: "Go Programming by Example", link: "https://www.packtpub.com/product/go-programming-by-example/9781800566471", category: "Books", skills: ["Go"], image: "../assets/go_programming_by_example.jpg" },
      { name: "The Go Programming Language", link: "https://www.oreilly.com/library/view/the-go-programming/9780134190440/", category: "Books", skills: ["Go"], image: "../assets/go_programming_language.jpg" },
      
    
      { name: "C++ Programming for Beginners", link: "https://www.youtube.com/watch?v=vLnPwxZdW4Y", category: "Videos", skills: ["C++"], image: "../assets/cpp_beginners.jpg" },
      { name: "Learn C++ in 1 Hour", link: "https://www.youtube.com/watch?v=1v7Hg2khcB4", category: "Videos", skills: ["C++"], image: "../assets/cpp_in_1_hour.jpg" },
      { name: "C++ Documentation", link: "https://en.cppreference.com/w/", category: "Articles", skills: ["C++"], image: "../assets/cpp_docs.jpg" },
      { name: "Learn C++", link: "https://www.learncpp.com/", category: "Articles", skills: ["C++"], image: "../assets/learn_cpp.jpg" },
      { name: "C++ Primer", link: "https://www.oreilly.com/library/view/c-primer-5th/9780133053043/", category: "Books", skills: ["C++"], image: "../assets/cpp_primer.jpg" },
      { name: "Effective C++", link: "https://www.oreilly.com/library/view/effective-c-3rd/9780321334879/", category: "Books", skills: ["C++"], image: "../assets/effective_cpp.jpg" },
      
     
      { name: "PHP Crash Course", link: "https://www.youtube.com/watch?v=OK_JCtrrv-c", category: "Videos", skills: ["PHP"], image: "../assets/php_crash.jpg" },
      { name: "PHP for Beginners", link: "https://www.youtube.com/watch?v=O6cM9I4c2A0", category: "Videos", skills: ["PHP"], image: "../assets/php_for_beginners.jpg" },
      { name: "PHP Documentation", link: "https://www.php.net/docs.php", category: "Articles", skills: ["PHP"], image: "../assets/php_docs.jpg" },
      { name: "PHP The Right Way", link: "https://phptherightway.com/", category: "Articles", skills: ["PHP"], image: "../assets/php_the_right_way.jpg" },
      { name: "Modern PHP", link: "https://www.oreilly.com/library/view/modern-php/9781788621755/", category: "Books", skills: ["PHP"], image: "../assets/modern_php.jpg" },
      { name: "PHP Objects, Patterns, and Practice", link: "https://www.oreilly.com/library/view/php-objects-patterns/9781491910405/", category: "Books", skills: ["PHP"], image: "../assets/php_objects_patterns.jpg" },
      
            
      { name: "Tailwind CSS Crash Course", link: "https://www.youtube.com/watch?v=UBOj6rqRrDh8", category: "Videos", skills: ["Tailwind"], image: "../assets/tailwind_css_crash.jpg" },
      { name: "Learn Tailwind CSS", link: "https://www.youtube.com/watch?v=6zIuAyF6lXQ", category: "Videos", skills: ["Tailwind"], image: "../assets/learn_tailwind_css.jpg" },
      { name: "Tailwind CSS Documentation", link: "https://tailwindcss.com/docs", category: "Articles", skills: ["Tailwind"], image: "../assets/tailwind_docs.jpg" },
      { name: "Tailwind CSS Tips", link: "https://dev.to/tailwindcss", category: "Articles", skills: ["Tailwind"], image: "../assets/tailwind_tips.jpg" },
      { name: "Refactoring UI with Tailwind CSS", link: "https://refactoringui.com/book/", category: "Books", skills: ["Tailwind"], image: "../assets/refactoring_ui_tailwind.jpg" },
      { name: "Designing with Tailwind CSS", link: "https://www.oreilly.com/library/view/designing-with-tailwind/9781098105851/", category: "Books", skills: ["Tailwind"], image: "../assets/designing_with_tailwind.jpg" },
      
           
      { name: "SQL for Beginners", link: "https://www.youtube.com/watch?v=HXV3zeQKqN0", category: "Videos", skills: ["SQL"], image: "../assets/sql_for_beginners.jpg" },
      { name: "SQL Tutorial", link: "https://www.youtube.com/watch?v=7S_tz1z_5bA", category: "Videos", skills: ["SQL"], image: "../assets/sql_tutorial.jpg" },
      { name: "SQL Documentation", link: "https://www.sqltutorial.org/", category: "Articles", skills: ["SQL"], image: "../assets/sql_docs.jpg" },
      { name: "SQL for Web Developers", link: "https://www.w3schools.com/sql/", category: "Articles", skills: ["SQL"], image: "../assets/sql_web_devs.jpg" },
      { name: "SQL in 10 Minutes", link: "https://www.oreilly.com/library/view/sql-in-10/9780789750306/", category: "Books", skills: ["SQL"], image: "../assets/sql_in_10_minutes.jpg" },
      { name: "Learning SQL", link: "https://www.oreilly.com/library/view/learning-sql/9781449369395/", category: "Books", skills: ["SQL"], image: "../assets/learning_sql.jpg" },


      
      { name: "Java Programming for Beginners", link: "https://www.youtube.com/watch?v=GoXwIVyNvX0", category: "Videos", skills: ["Java"], image: "../assets/java_programming_beginners.jpg" },
      { name: "Java Crash Course", link: "https://www.youtube.com/watch?v=grEKMHGYegc", category: "Videos", skills: ["Java"], image: "../assets/java_crash_course.jpg" },
      { name: "Java Documentation", link: "https://docs.oracle.com/en/java/", category: "Articles", skills: ["Java"], image: "../assets/java_docs.jpg" },
      { name: "Java Tutorial for Beginners", link: "https://www.w3schools.com/java/", category: "Articles", skills: ["Java"], image: "../assets/java_tutorial_beginners.jpg" },
      { name: "Effective Java", link: "https://www.oreilly.com/library/view/effective-java/9780134685991/", category: "Books", skills: ["Java"], image: "../assets/effective_java.jpg" },
      { name: "Head First Java", link: "https://www.oreilly.com/library/view/head-first-java/9780596009205/", category: "Books", skills: ["Java"], image: "../assets/head_first_java.jpg" }
      
      
    ];

    const defaultRecommendations = [
      { name: "Introduction to Programming", link: "https://www.khanacademy.org/computing/computer-programming", category: "Videos", image: "../assets/programming_intro.jpg" },
      { name: "Python Crash Course", link: "https://www.youtube.com/watch?v=rfscVS0vtbw", category: "Videos", image: "../assets/python.jpg" },
      { name: "Learn to Code for Free", link: "https://www.freecodecamp.org/", category: "Articles", image: "../assets/freecodecamp.jpg" },
      { name: "JavaScript Basics", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", category: "Articles", image: "../assets/javascript.jpg" },
      { name: "CS50: Introduction to CS", link: "https://pll.harvard.edu/course/cs50-introduction-computer-science", category: "Courses", image: "../assets/cs50.jpg" },
      { name: "The Odin Project", link: "https://www.theodinproject.com/", category: "Courses", image: "../assets/odin_project.jpg" },
    ];

    if (userSkills.length > 0) {
      const filteredRecommendations = dynamicRecommendations.filter((rec) =>
        rec.skills.some((skill) => userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase()))
      );
      console.log("Filtered Recommendations:", filteredRecommendations); // Debugging
      setRecommendations(filteredRecommendations);
    } else {
      console.log("Using default recommendations:", defaultRecommendations); // Debugging
      setRecommendations(defaultRecommendations);
    }
  }, [userSkills]);

  return (
    <ProtectedRoute>
      <SkillHub
        userSkills={userSkills}
        recommendations={recommendations}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default SkillHubPage;
