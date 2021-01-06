import { useContext } from 'react';
import { TodoContext } from '../pages';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Todo from './todo';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import { sort } from '../utils/sort';
import { TableCellProps } from '@material-ui/core/TableCell/TableCell';

type listItem = {
    title?: any
    limit?: any 
    createdAt?: any
    updatedAt?: any
    status?: any
    description?: any
    id?: any
}

export type listItems = listItem[]

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
            <Typography variant="h3" gutterBottom>
                Todos
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>選択</TableCell>
                            {listItems.map( (listItem, index) => (
                                <TableCell 
                                    key={index}
                                    onClick={() => handleSort(listItem.name)}
                                    align={listItem.align as TableCellProps['align']}
                                    className={listItem.name === sortBy[0] ? classes.onSortByActive : ''}
                                >
                                    {listItem.label}
                                    {listItem.name === sortBy[0] && sortBy[1] && ( <> ▼</> )}
                                    {listItem.name === sortBy[0] && !sortBy[1] && ( <> ▲</> )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <Todo />
                </Table>
            </TableContainer>
        </>
    )
}