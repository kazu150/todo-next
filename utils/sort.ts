import { row, contextType } from '../pages/'

export const sort = (row: row[], sortBy: contextType['sortBy']): row[] => {
    return row.sort((a,b) => {
        if(sortBy[1]){
            if(a[sortBy[0]] > b[sortBy[0]]) return 1;
            if(a[sortBy[0]] < b[sortBy[0]]) return -1;
            return 0;

        } else {
            if(a[sortBy[0]] < b[sortBy[0]]) return 1;
            if(a[sortBy[0]] > b[sortBy[0]]) return -1;
            return 0;
        }
    })
}