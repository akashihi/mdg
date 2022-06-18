import React, {Component, Fragment} from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NavLink } from 'react-router-dom'

export default class TopBar extends Component {
    state = {
        anchorEl: null,
    };

    componentDidMount() {
        this.props.currencyActions.loadCurrencyList();
        this.props.settingActions.loadSettingList();
        this.props.budgetActions.loadBudgetList();
        this.props.tagActions.loadTagList();
        this.props.rateActions.loadRatesList();
    }

    openMenu(event){
        this.setState({anchorEl: event.currentTarget});
    }

    primaryTopBar() {
        const leftButtons = (
            <Fragment>
                <NavLink to='/'>Overview</NavLink>
                <NavLink to='/budget'>Budget</NavLink>
                <NavLink to='/transactions'>Transactions</NavLink>
                <NavLink to='/reports'>Reports</NavLink>
                <NavLink to='/accounts'>Accounts</NavLink>
            </Fragment>
        );

        const rightButtons = (
            <Fragment>
                <NavLink to='/settings'>Settings</NavLink>
            </Fragment>
        );
        return (
            <AppBar position='static' className='hide-on-small hide-on-medium'>
                <Toolbar>
                    <Typography type='title' color='inherit' style={{flex: 1}}>
                        {leftButtons}
                    </Typography>
                    {rightButtons}
                </Toolbar>
            </AppBar>
        )
    }

    smallTopBar() {
        const { anchorEl } = this.state;

        var currentPage;
        switch (this.props.path) {
            case '/':
                currentPage='Overview';
                break;
            case '/budget':
                currentPage='Budget';
                break;
            case '/transactions':
                currentPage='Transactions';
                break;
            case '/reports':
                currentPage='Reports';
                break;
            case '/accounts':
                currentPage='Accounts';
                break;
            case '/settings':
                currentPage='Settings';
                break;
        }
        return (<AppBar position='static' className='hide-on-big'>
            <Toolbar>
                <IconButton color='inherit' aria-label='Menu' onClick={::this.openMenu}>
                    <MenuIcon/>
                </IconButton>
                <Button variant='outlined' color='inherit'>{currentPage}</Button>
            </Toolbar>
            <Menu id='top-small-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
                <MenuItem><NavLink to='/'>Overview</NavLink></MenuItem>
                <MenuItem><NavLink to='/budget'>Budget</NavLink></MenuItem>
                <MenuItem><NavLink to='/transactions'>Transactions</NavLink></MenuItem>
                <MenuItem><NavLink to='/reports'>Reports</NavLink></MenuItem>
                <MenuItem><NavLink to='/accounts'>Accounts</NavLink></MenuItem>
                <MenuItem><NavLink to='/settings'>Settings</NavLink></MenuItem>
            </Menu>
        </AppBar>)
    }

    render() {
        const mainTopBar = this.primaryTopBar();
        const smallTopBar = this.smallTopBar();

        return (
            <Fragment>
                {mainTopBar}
                {smallTopBar}
            </Fragment>
        )
    }
}
