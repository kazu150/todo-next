import { useContext } from 'react';
import { TodoContext } from '../pages/';
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

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
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
        setSortBy(itemName)
        dispatch({
            type: 'update_row',
            payload: sort(state.rows, itemName)
        })
    }

    return (
        <>
            <Typography variant="h3" gutterBottom>
                Todos
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell onClick={() => handleSort('title')}>タイトル</TableCell>
                            <TableCell onClick={() => handleSort('limit')} align="right">期限</TableCell>
                            <TableCell onClick={() => handleSort('createdAt')} align="right">作成日</TableCell>
                            <TableCell onClick={() => handleSort('updatedAt')} align="right">最終更新日</TableCell>
                            <TableCell onClick={() => handleSort('status')} align="right">状態</TableCell>
                        </TableRow>
                    </TableHead>
                    <Todo />
                </Table>
            </TableContainer>
        </>
    )
}