import React, { Component, Fragment, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NavLink, useLocation } from 'react-router-dom';

function SmallTopBar () {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  let currentPage;
  switch (location.pathname) {
    case '/':
      currentPage = 'Overview';
      break;
    case '/budget':
      currentPage = 'Budget';
      break;
    case '/transactions':
      currentPage = 'Transactions';
      break;
    case '/reports':
      currentPage = 'Reports';
      break;
    case '/accounts':
      currentPage = 'Accounts';
      break;
    case '/settings':
      currentPage = 'Settings';
      break;
  }
  return (
    <AppBar position='static' className='hide-on-big'>
      <Toolbar>
        <IconButton color='inherit' aria-label='Menu' onClick={(e) => { setMenuOpen(true); setAnchorEl(e.currentTarget) }}>
          <MenuIcon />
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
    </AppBar>
  )
}

function PrimaryTopBar () {
  const location = useLocation();

  let buttonClassOverview = 'menu-button';
  let buttonClassBudget = 'menu-button';
  let buttonClassTransactions = 'menu-button';
  let buttonClassReports = 'menu-button';
  let buttonClassAccounts = 'menu-button';
  let buttonClassSettings = 'menu-button';

  switch (location.pathname) {
    case '/':
      buttonClassOverview = 'selected-menu-btn';
      break;
    case '/budget':
      buttonClassBudget = 'selected-menu-btn';
      break;
    case '/transactions':
      buttonClassTransactions = 'selected-menu-btn';
      break;
    case '/reports':
      buttonClassReports = 'selected-menu-btn';
      break;
    case '/accounts':
      buttonClassAccounts = 'selected-menu-btn';
      break;
    case '/settings':
      buttonClassSettings = 'selected-menu-btn';
      break;
  }
  const leftButtons = (
    <>
      <NavLink to='/' className='nav-link'><Button variant='contained' className={buttonClassOverview}> Overview</Button></NavLink>
      <NavLink to='/budget' className='nav-link'><Button variant='contained' className={buttonClassBudget}>Budget</Button></NavLink>
      <NavLink to='/transactions' className='nav-link'><Button variant='contained' className={buttonClassTransactions}>Transactions</Button></NavLink>
      <NavLink to='/reports' className='nav-link'><Button variant='contained' className={buttonClassReports}>Reports</Button></NavLink>
      <NavLink to='/accounts' className='nav-link'><Button variant='contained' className={buttonClassAccounts}>Accounts</Button></NavLink>
    </>
  )

  const rightButtons = (
    <>
      <NavLink to='/settings' className={isActive => 'nav-link' + (isActive ? ' nav-link-selected' : '')}><Button variant='contained' className={buttonClassSettings}>Settings</Button></NavLink>
    </>
  )
  return (
    <AppBar position='static' className='hide-on-small hide-on-medium'>
      <Toolbar>
        <Typography type='title' color='inherit' style={{ flex: 1 }}>
          {leftButtons}
        </Typography>
        {rightButtons}
      </Toolbar>
    </AppBar>
  )
}

export default class TopBar extends Component {
  componentDidMount () {
    this.props.currencyActions.loadCurrencyList()
    this.props.settingActions.loadSettingList()
    this.props.budgetActions.loadBudgetList()
    this.props.tagActions.loadTagList()
    this.props.rateActions.loadRatesList()
  }

  render () {
    return (
      <>
        <PrimaryTopBar />
        <SmallTopBar />
      </>
    )
  }
}
