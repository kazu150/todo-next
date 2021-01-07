import { useContext } from 'react';
import { TodoContext } from '../pages/';
import { makeStyles } from '@material-ui/core/styles';
import Todo from './todo';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import { sort } from '../utils/sort';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    onSortByActive: {
        textDecoration: 'underline',
        fontWeight: 'bold'
    }
});

export default function TodoList() {
    const classes = useStyles();

    const { 
        sortBy, 
        setSortBy, 
        state, 
        dispatch 
    } = useContext(TodoContext)

    const handleSort = (itemName) => {
        if(itemName !== sortBy[0]){
            setSortBy([itemName, true])
            dispatch({
                type: 'row_update',
                payload: sort(state.rows, [itemName, true])
            })

        } else {
            const order = !sortBy[1]
            setSortBy([itemName, order])
            dispatch({
                type: 'row_update',
                payload: sort(state.rows, [itemName, order])
            })
        }
    }

    const listItems = [
        { name: 'title', label: 'タイトル', align: 'left' },
        { name: 'limit', label: '期限', align: 'right' },
        { name: 'createdAt', label: '作成日', align: 'right' },
        { name: 'updatedAt', label: '最終更新日', align: 'right' },
        { name: 'status', label: '状態', align: 'right' }
    ]

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <colgroup>
                        <col width="5%" />
                        <col width="40%" />
                        <col width="15%" />
                        <col width="15%" />
                        <col width="15%" />
                        <col width="10%" />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell>選択</TableCell>
                            {listItems.map( (listItem, index) => (
                                <TableCell 
                                    key={index}
                                    onClick={() => handleSort(listItem.name)}
                                    align={listItem.align}
                                    className={listItem.name === sortBy[0] ? classes.onSortByActive : ''}
                                >
                                    {listItem.label}
                                    {listItem.name === sortBy[0] && sortBy[1] && ( <> ▼</> )}
                                    {listItem.name === sortBy[0] && !sortBy[1] && ( <> ▲</> )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <Todo listItems={listItems} />
                </Table>
            </TableContainer>
        </>
    )
}