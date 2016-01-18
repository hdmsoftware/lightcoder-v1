'use strict';

//Editors service used for communicating with the editors REST endpoints
angular.module('editors').factory('Editors', ['$resource',
  function ($resource) {

    return $resource('api/editors/:editorId', {
      editorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      compileit: {
                 method: 'POST',
                 url:'api/editors/compile',
                 headers: { 'Content-Type': 'application/json; charset=UTF-8' }
       }
    });

  }
]);

angular.module('editors').factory("Languages", [function() {
   return [
      {id:0, name:"C#", text: "text/x-csharp" , mode: "csharp"},
      {id:1,name:"C/C++" , text:"text/x-c++src", mode:"c_cpp"},
      {id:2,name:"Clojure" , text:"text/x-clojure" ,mode:"clojure"},
      {id:3, name:"Java" ,text:"text/x-go", mode:"java"},
      {id:4, name:"Go" ,text:"text/javascript", mode:"golang"},
      {id:5, name:"PHP" ,text:"text/x-php", mode:"php"},
      {id:6, name:"Python" ,text:"text/x-python", mode:"python"},
      {id:7, name:"Ruby" , text:"text/x-ruby", mode:"ruby"},
      {id:8, name:"Scala" ,text:"text/x-scala", mode:"scala"},
      {id:9, name:"VB.NET" , text:"text/x-vb", mode:"vbnet"},
      {id:10, name:"Objective-C" ,text:"text/x-objectivec", mode:"objectivec"},
      {id:11, name:"Perl", text:"text/x-perl", mode:"perl"}
  ]
}]);

angular.module('editors').factory("Codes", [function() {
   return {
      "Perl" : "use strict;\nuse warnings\n;use v5.14; say 'Hello Perl';",
    "MySQL":"create table myTable(name varchar(10));\ninsert into myTable values(\"Hello\");\nselect * from myTable;",
    "Java": "import java.io.*;\n\nclass myCode\n{\n\tpublic static void main (String[] args) throws java.lang.Exception\n\t{\n\t\t\n\t\tSystem.out.println(\"Hello\");\n\t}\n}",
    "C/C++": "#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout<<\"Hello\";\n\treturn 0;\n}",
    "C#": "using System;\n\npublic class Test\n{\n\tpublic static void Main()\n\t{\n\t\t\tConsole.WriteLine(\"Hello\");\n\t}\n}",
    "Clojure": '(println "Hello Clojure")',
    "Go": "package main\nimport \"fmt\"\n\nfunc main(){\n  \n\tfmt.Printf(\"Hello GO\")\n}",
    "Plain JavaScript": "//Not happy with Plain JS? Use JS/HTML/CSS option for using your own libraries.\n\nconsole.log(\"Hello\");",
    "PHP": "<?php\n$ho = fopen('php://stdout', \"w\");\n\nfwrite($ho, \"Hello\");\n\n\nfclose($ho);\n",
    "Python": "print \"Hello from Python\"",
    "Ruby": "puts \"Hello from Ruby\"",
    "Bash": "echo 'Hi' ",
    "Objective-C": "#include <Foundation/Foundation.h>\n\n@interface Test\n+ (const char *) classStringValue;\n@end\n\n@implementation Test\n+ (const char *) classStringValue;\n{\n    return \"Hey!\";\n}\n@end\n\nint main(void)\n{\n    printf(\"%s\\n\", [Test classStringValue]);\n    return 0;\n}",
    "Scala": "object HelloWorld {def main(args: Array[String]) = println(\"Hello from Scala\")}",
    "VB.NET": "Imports System\n\nPublic Class Test\n\tPublic Shared Sub Main() \n    \tSystem.Console.WriteLine(\"Hello\")\n\tEnd Sub\nEnd Class"
  }
}]);




