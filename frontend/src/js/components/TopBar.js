import React, {Component, Fragment, useState} from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

function smallTopBar(props) {

    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    let currentPage;
    switch (props.location.pathname) {
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
            <IconButton color='inherit' aria-label='Menu' onClick={(e) => {setMenuOpen(true);setAnchorEl(e.currentTarget)}}>
                <MenuIcon/>
            </IconButton>
            <Button variant='outlined' color='inherit'>{currentPage}</Button>
        </Toolbar>
        <Menu id='top-small-menu' anchorEl={anchorEl} open={menuOpen} onClose={() => setMenuOpen(false)}>
            <MenuItem><NavLink to='/'>Overview</NavLink></MenuItem>
            <MenuItem><NavLink to='/budget'>Budget</NavLink></MenuItem>
            <MenuItem><NavLink to='/transactions'>Transactions</NavLink></MenuItem>
            <MenuItem><NavLink to='/reports'>Reports</NavLink></MenuItem>
            <MenuItem><NavLink to='/accounts'>Accounts</NavLink></MenuItem>
            <MenuItem><NavLink to='/settings'>Settings</NavLink></MenuItem>
        </Menu>
    </AppBar>)
}

const SmallTopBarLocation = withRouter(smallTopBar)

function PrimaryTopBar(){
    const leftButtons = (
        <Fragment>
            <NavLink to='/' className={isActive =>'nav-link' + (isActive ? ' nav-link-selected' : '')}><Button variant='contained' className={isActive =>'menu-button' + (isActive ? ' selected-menu-btn' : '')}> Overview</Button></NavLink>
            <NavLink to='/budget' className={isActive =>'nav-link' + (isActive ? ' nav-link-selected' : '')}><Button variant='contained' className='menu-button'>Budget</Button></NavLink>
            <NavLink to='/transactions' className={isActive =>'nav-link' + (isActive ? ' nav-link-selected' : '')}><Button variant='contained' className='menu-button'>Transactions</Button></NavLink>
            <NavLink to='/reports' className={isActive =>'nav-link' + (isActive ? ' nav-link-selected' : '')}><Button variant='contained' className='menu-button' >Reports</Button></NavLink>
            <NavLink to='/accounts' className={isActive =>'nav-link' + (isActive ? ' nav-link-selected' : '')}><Button variant='contained' className='menu-button'>Accounts</Button></NavLink>
        </Fragment>
    );

    const rightButtons = (
        <Fragment>
            <NavLink to='/settings' className={isActive =>'nav-link' + (isActive ? ' nav-link-selected' : '')}>Settings</NavLink>
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

export default class TopBar extends Component {
    componentDidMount() {
        this.props.currencyActions.loadCurrencyList();
        this.props.settingActions.loadSettingList();
        this.props.budgetActions.loadBudgetList();
        this.props.tagActions.loadTagList();
        this.props.rateActions.loadRatesList();
    }

    render() {
        return (
            <Fragment>
                <PrimaryTopBar/>
                <SmallTopBarLocation/>
            </Fragment>
        )
    }
}
