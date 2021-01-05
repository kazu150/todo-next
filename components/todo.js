import React, { useContext } from 'react';
import { TodoContext } from '../pages/'
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

export default function Todo() {
    const {
        setOpen,
        state,
        dispatch
    } = useContext(TodoContext)

    const onItemClicked = (id) => {
        setOpen(true)
        dispatch({
            type: 'selectedTodo_set',
            payload: state.rows.filter(row => row.id === id)[0]
        })
    }

    const useStyles = makeStyles((theme) => ({
        normal: {
            backgroundColor: "#fff"
        },
        inProgress: {
            backgroundColor: "#DDD"
        },
        finished: {
            backgroundColor: "#444"
        }

    }));

    const classes = useStyles();

    return (
        <TableBody>
            {state.rows.map((row, index) => (
                <TableRow 
                    className={
                        (() => {
                            switch(row.status){
                                case "未着手": 
                                    return classes.normal;
                                case "途中":
                                    return classes.inProgress;
                                case "完了":
                                    return classes.finished;
                                default:
                                    return classes.normal;
                            }
                        })()
                    }
                    key={row.id} 
                    onClick={() => onItemClicked(row.id)}
                >
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell component="th" scope="row">
                        {row.title}
                    </TableCell>
                    <TableCell align="right">{row.limit}</TableCell>
                    <TableCell align="right">{row.createdAt}</TableCell>
                    <TableCell align="right">{row.updatedAt}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}