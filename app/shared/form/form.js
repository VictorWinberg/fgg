angular.module('form', [])
  .controller('FormController', function ($scope) {
    $scope.attendee = {
      name: '',
      position: ''
    }
    $scope.attendees = [];

    $scope.addAttendee = function () {
      $scope.attendees.push({
        name: $scope.attendee.name,
        position: $scope.attendee.position
      });
      $scope.attendee = {}
    };
    $scope.removeAttendee = function (attendee) {
      $scope.attendees.splice($scope.attendees.indexOf(attendee), 1);
    };

    $scope.paragraph = {
      title: '',
      content: ''
    }
    $scope.paragraphs = [];
    $scope.addParagraph = function () {
      $scope.paragraphs.push({
        title: $scope.paragraph.title,
        content: $scope.paragraph.content
      });
      $scope.paragraph = {}
    };
    $scope.removeParagraph = function (paragraph) {
      $scope.paragraphs.splice($scope.paragraphs.indexOf(paragraph), 1);
    };

    $scope.signature = {
      comment: '',
      name: '',
      position: ''
    }
    $scope.signatures = [];
    $scope.addSignature = function () {
      $scope.signatures.push({
        comment: $scope.signature.comment,
        name: $scope.signature.name,
        position: $scope.signature.position
      });
      $scope.signature = {}
    };
    $scope.removeSignature = function (signature) {
      $scope.signatures.splice($scope.signatures.indexOf(signature), 1);
    };

    $scope.github = {
      username: '',
      password: ''
    }

    $scope.submit = async function (form) {
      const protocol = ['\\documentclass{fgg}\n'];
      const v = $("form").serializeArray().reduce((groups, item, idx) => {
        if (item['name'].includes(".")) {
          const val = item['name'].split('.')[0]
          groups[val] = groups[val] || []
          groups[val].push(item)
        } else {
          const val = item['name']
          groups[val] = item['value']
        }

        return groups
      }, {});
      console.log(v);

      const zip = (array, nbr) => array.reduce(function (result, value, index, array) {
        if (index % nbr === 0) {
          var vars = array.slice(index, index + nbr).reduce((res, item, idx) => ({
            ...res,
            [item.name.split(".")[1]]: item.value
          }), {});
          result.push(vars);
        }
        return result;
      }, []);

      const formatDate = (date) => {
        var monthNames = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];
        var weekdayNames = ["Söndagen", "Måndagen", "Tisdagen", "Onsdagen", "Torsdagen", "Fredagen", "Lördagen"];

        var day = date.getDate();
        var weekday = date.getDay();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return `${weekdayNames[weekday]} den ${day} ${monthNames[monthIndex]} ${year}`
      }

      protocol.push(`\\title{${v['title'] || 'Protokoll styrelsemöte'}}`);
      if (v['subtitle']) protocol.push(`\\subtitle{${v['subtitle']}}`);
      protocol.push('\\author{Fina Grabbarnas Grupp}\n');

      var date = v['date'] ? new Date(v['date']) : new Date();
      protocol.push(`\\date{\\formatdate{${date.getDate()}}{${date.getMonth()+1}}{${date.getFullYear()}}}`);
      protocol.push(`\\datum{${formatDate(date)}}`);

      protocol.push(`\\plats{${v['location'] || 'FGG HQ'}}`);
      protocol.push('');
      protocol.push('\\begin{document}');
      protocol.push('\\makehf');
      protocol.push('\\maketitle');

      if (v['attendee']) {
        protocol.push('');
        protocol.push('\\begin{narvaro}');
        zip(v['attendee'], 2).forEach(({
          name,
          position
        }) => {
          protocol.push(`\t\\person{${name}}{${position}}`);
        })
        protocol.push('\\end{narvaro}');
      };

      if (v['paragraph']) {
        protocol.push('');
        protocol.push('\\begin{protokoll}');
        zip(v['paragraph'], 2).forEach(({
          title,
          content
        }, idx) => {
          protocol.push(`\t\\paragraf{${idx+1}}{${title}}\n\t${content}`);
        })
        protocol.push('\\end{protokoll}');
      };

      if (v['signature']) {
        protocol.push('');
        zip(v['signature'], 3).forEach(({
          comment,
          name,
          position
        }) => {
          protocol.push(`\\signature{${comment}}{${name}}{${position}}`);
        })
      };

      protocol.push('');
      protocol.push('\\end{document}');

      console.log(protocol.join('\n'));

      var auth = btoa($scope.github.username + ":" + $scope.github.password);

      var yymmdddate = `${date.getFullYear().toString().substr(-2)}${("0" + (date.getMonth() + 1)).slice(-2)}${("0" + date.getDate()).slice(-2)}`
      var filename = `${(v['title'] || 'Protokoll styrelsemöte').replace(/\s+/g, '-').toLowerCase()}-${yymmdddate}`

      function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
          (match, p1) => String.fromCharCode('0x' + p1)));
      }

      await fetch(`https://api.github.com/repos/victorwinberg/fgg/contents/protokoll/${filename}.tex`, {
        method: 'PUT',
        headers: {
          'Authorization': "Basic " + auth,
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          message: `Dokument: ${v['title'] || 'Protokoll styrelsemöte'} - ${yymmdddate}`,
          content: b64EncodeUnicode(protocol.join('\n'))
        })
      }).then(res => res.json()).then(json => {
        if (json && json.content && json.content.path) {
          var latexonline = `https://latexonline.cc/compile?command=xelatex&download=${filename}.pdf&git=https://github.com/victorwinberg/fgg&target=`;
          window.location = latexonline + json.content.path;
        }
      })
    };
  });