export const sort = (row, sortBy) => {
    return row.sort((a,b) => {
        if(a[sortBy] > b[sortBy]) return 1;
        if(a[sortBy] < b[sortBy]) return -1;
        return 0;
    })
}