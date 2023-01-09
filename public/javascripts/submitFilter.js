function submitFilter() {
    const queries = document.querySelectorAll('.filter input')
    // console.log('1', queries[0]);
    let queryString = '';
    queries.forEach((query, index) => {
        if(query.value !== '') {
            queryString += `${query.name}=${query.value}`;
            if(index !== queries.length) queryString += '&';
        }
        
    })
    console.log(queryString);
    // form.action = queryString;
}
const form = document.querySelector('.filter');
// form.addEventListener('submit', submitFilter);
// form.addEventListener('submit', e => {
//     // e.preventDefault();
//     const queries = document.querySelectorAll('.filter input')
//     // console.log('1', queries[0]);
//     let queryString = '';
//     queries.forEach((query, index) => {
//         if(query.value !== '') {
//             queryString += `${query.name}=${query.value}`;
//             if(index !== queries.length) queryString += '&';
//         }
        
//     })
//     console.log(queryString);
//     form.action = queryString;
//     e.unbind('submit').submit();
// });

