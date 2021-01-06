import React, { useContext, FC, SyntheticEvent } from 'react';
import { TodoContext } from '../pages'
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Checkbox from '@material-ui/core/Checkbox';
import { row } from '../pages/'

const Todo: FC = () => {
    const {
        setOpen,
        state,
        dispatch,
        checked,
        setChecked
    } = useContext(TodoContext)

    const onItemClicked = (id: number) => {
        setOpen(true)
        dispatch({
            type: 'selectedTodo_set',
            payload: state.rows.filter((row: row) => row.id === id)[0]
        })
    }

    const handleCheck = (event: SyntheticEvent) => {
        setOpen(false)
        dispatch({ type: 'selectedTodo_clear' })
        
        // TODO - エラー取れず
        const isChecked: boolean = checked.length ? checked.some((item: string) => item === event.target.name) : false
        if(isChecked){
            setChecked([ ...checked ].filter((item: string) => item !== event.target.name))
        } else {
            setChecked([ ...checked, event.target.name ])
        }
    };
    

    const useStyles = makeStyles((theme) => ({
        normal: {
            backgroundColor: "#fff"
        },
        inProgress: {
            backgroundColor: "#DDD"
        },
        finished: {
            backgroundColor: "#555"
        }

    }));

    const classes = useStyles();
    
    return (
        <TableBody>
            {state.rows.map((row) => (
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
                    <TableCell>
                        <Checkbox
                            onChange={handleCheck}
                            name={row.id.toString()}
                            checked={checked.length ? checked.some(item => item === row.id.toString()) : false}
                            color="primary"
                        />
                    </TableCell>
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

export default Todo;