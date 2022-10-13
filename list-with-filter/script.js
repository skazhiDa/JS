(() => {
  document.addEventListener('DOMContentLoaded', () => {
    let studentData = {
      name: '',
      sureName: '',
      midName: '',
      birthday: '',
      startYear: '',
      faculty: '',
    };
    const studentArr = [];
    let filterArr = [];
    const actualDate = new Date();
    const inputs = document.querySelectorAll('.form-input');
    const filterName = document.getElementById('filter__name');
    const filterFaculty = document.getElementById('filter__faculty');
    const filterStartYear = document.getElementById('filter__start-year');
    const filterGradYear = document.getElementById('filter__grad-year');
    const headElements = document.querySelectorAll('.clickable');
    const inputName = document.getElementById('name');
    const inputBirth = document.getElementById('birthday');
    const inputStart = document.getElementById('start-year');
    const inputFaculty = document.getElementById('faculty');

    function parseStudentName(dataString) {
      return dataString
        .split(' ')
        .filter((text) => text.length > 0)
        .map((str) => str.trim());
    }

    function parseYear(date) {
      // eslint-disable-next-line radix,max-len
      if (((parseInt(date) + 4) === parseInt(actualDate.getFullYear().toString()))
        // eslint-disable-next-line radix
        && (parseInt(actualDate.getMonth().toString()) >= 8))
      // eslint-disable-next-line radix,brace-style
      { return `${date}-${actualDate.getFullYear()} (graduated)`; }
      // eslint-disable-next-line radix
      return `${date}-${parseInt(date) + 4}
      (${(actualDate.getFullYear() - date) <= 4 ? `${actualDate.getFullYear() - date + 1} course` : 'graduated'})`;
    }

    function parseBirthday(date) {
      // eslint-disable-next-line radix
      if (((parseInt(actualDate.getMonth().toString()) + 1) <= parseInt(date.split('-')[1]))
      // eslint-disable-next-line radix
      && (parseInt(actualDate.getDate().toString()) < parseInt(date.split('-')[2]))) {
        return `${date
          .split('-')
          .reverse()
          .join('.')
        } (${actualDate.getFullYear() - date.split('-')[0] - 1} years)`;
      }
      return `${date
        .split('-')
        .reverse()
        .join('.')
      } (${actualDate.getFullYear() - date.split('-')[0]} years)`;
    }

    function createTable(arr) {
      document.getElementById('table-body').innerHTML = '';
      arr.forEach((data) => {
        const tableRow = document.createElement('tr');
        const tableName = document.createElement('td');
        const tableBirth = document.createElement('td');
        const tableStartYear = document.createElement('td');
        const tableFaculty = document.createElement('td');

        tableName.textContent = [data.name, data.sureName, data.midName].join(' ');
        tableBirth.textContent = data.birthday;
        tableStartYear.textContent = data.startYear;
        tableFaculty.textContent = data.faculty;

        tableRow.append(tableName);
        tableRow.append(tableBirth);
        tableRow.append(tableStartYear);
        tableRow.append(tableFaculty);

        document.getElementById('table-body').append(tableRow);
      });
    }

    function filterBySubstring(arr, substring, faculty = false) {
      // eslint-disable-next-line array-callback-return
      if (!faculty) {
        return arr.filter((student) => [student.name, student.sureName, student.midName].join(' ')
          .includes(substring));
      }
      return arr.filter((student) => student.faculty.includes(substring));
    }

    function filterByYear(arr, year, gradYear = false) {
      if (!gradYear) {
        // eslint-disable-next-line array-callback-return,max-len
        return (arr.filter((student) => student.startYear.substring(0, 4).includes(year)));
      }
      // eslint-disable-next-line array-callback-return,max-len
      return (arr.filter((student) => student.startYear.substring(5, 9).includes(year)));
    }

    function mainFilter() {
      const studentArrDeepcopy = JSON.parse(JSON.stringify(studentArr));
      let filteredArr = JSON.parse(JSON.stringify(studentArr));
      if (filterName.value) filteredArr = filterBySubstring(studentArrDeepcopy, filterName.value);
      // eslint-disable-next-line max-len
      if (filterFaculty.value) filteredArr = filterBySubstring(filteredArr, filterFaculty.value, true);
      if (filterStartYear.value) filteredArr = filterByYear(filteredArr, filterStartYear.value);
      if (filterGradYear.value) filteredArr = filterByYear(filteredArr, filterGradYear.value, true);
      createTable(filteredArr);
      filterArr = JSON.parse(JSON.stringify(filteredArr));
    }

    // eslint-disable-next-line consistent-return
    function ascendingSort(elemId) {
      switch (elemId) {
        case 'headName':
          return filterArr.sort((curr, next) => {
            if ([curr.name, curr.sureName, curr.midName].join(' ') > [next.name, next.sureName, next.midName].join(' ')) {
              return 1;
            }
            if (curr.name < next.name) {
              return -1;
            }
            // curr must be equal to next
            return 0;
          });
        case 'headBirth':
          return filterArr.sort((curr, next) => {
            if (curr.birthday < next.birthday) {
              return -1;
            }
            if (curr.birthday > next.birthday) {
              return 1;
            }
            // curr must be equal to next
            return 0;
          });
        case 'headStart':
          return filterArr.sort((curr, next) => {
            if (curr.startYear < next.startYear) {
              return -1;
            }
            if (curr.startYear > next.startYear) {
              return 1;
            }
            // curr must be equal to next
            return 0;
          });
        case 'headFaculty':
          return filterArr.sort((curr, next) => {
            if (curr.faculty > next.faculty) {
              return 1;
            }
            if (curr.faculty < next.faculty) {
              return -1;
            }
            // curr must be equal to next
            return 0;
          });
        default:
          // eslint-disable-next-line no-console
          console.log('line 130');
      }
    }

    function validate() {
      if (!inputName.value.trim()) {
        const warning = document.getElementById('required-name');
        warning.style.display = 'inline';
        return false;
      }
      if (!inputStart.value.trim()) {
        const warning = document.getElementById('required-start');
        warning.style.display = 'inline';
        return false;
        // eslint-disable-next-line radix
      } if (!(parseInt(inputStart.value.trim().split('-')[0]) >= 2000)) {
        const warning = document.getElementById('min-start');
        warning.style.display = 'inline';
        return false;
        // eslint-disable-next-line radix
      } if (!(parseInt(inputStart.value.trim().split('-')[0]) <= parseInt(actualDate.getFullYear().toString()))) {
        const warning = document.getElementById('max-start');
        warning.style.display = 'inline';
        return false;
      }
      if (!inputBirth.value.trim()) {
        const warning = document.getElementById('required-birth');
        warning.style.display = 'inline';
        return false;
        // eslint-disable-next-line radix
      } if (!(parseInt(inputBirth.value.trim().split('-')[0]) >= 1900)) {
        const warning = document.getElementById('min-birth');
        warning.style.display = 'inline';
        return false;
        // eslint-disable-next-line radix
      } if (!(parseInt(inputBirth.value.trim().split('-')[0]) <= parseInt(actualDate.getFullYear().toString()))) {
        const warning = document.getElementById('max-birth');
        warning.style.display = 'inline';
        return false;
      }
      if (!inputFaculty.value.trim()) {
        const warning = document.getElementById('required-faculty');
        warning.style.display = 'inline';
        return false;
      }
      return true;
    }

    function cleanForm() {
      inputs.forEach((el) => { el.value = null; });
    }

    filterName.addEventListener('input', () => mainFilter());
    filterFaculty.addEventListener('input', () => mainFilter());
    filterStartYear.addEventListener('input', () => mainFilter());
    filterGradYear.addEventListener('input', () => mainFilter());

    headElements.forEach((header) => {
      header.addEventListener('click', () => createTable(ascendingSort(header.id)));
    });

    document.getElementById('form-submit').addEventListener('click', (event) => {
      if (validate(event)) {
        const name = document.getElementById('name').value;
        const parsedName = parseStudentName(name);
        const startYear = document.getElementById('start-year').value;
        const parsedStartYear = parseYear(startYear);
        const birthday = document.getElementById('birthday').value;
        const parsedBirthday = parseBirthday(birthday);
        studentData = {
          name: parsedName[0],
          sureName: parsedName[1],
          midName: parsedName[2],
          birthday: parsedBirthday,
          startYear: parsedStartYear,
          faculty: document.getElementById('faculty').value,
        };
        studentArr.push(studentData);
        filterArr = JSON.parse(JSON.stringify(studentArr));
        createTable(studentArr);
        cleanForm();
      }
      event.preventDefault();
    });
    inputs.forEach((elem) => {
      elem.addEventListener('input', () => {
        document.querySelectorAll('.warning').forEach((el) => {
          el.style.display = 'none';
        });
      });
    });
  });
})();
