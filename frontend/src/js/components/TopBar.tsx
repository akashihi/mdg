import React, {Component, Fragment, useEffect, useState} from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NavLink, useLocation } from 'react-router-dom';
import {TopBarProps} from "../containers/TopBar";

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
  const pathname = useLocation().pathname;

  const leftButtons = (
    <Fragment>
      <NavLink to='/' className='nav-link'><Button variant='contained' className={pathname === '/' ? 'selected-menu-btn' : 'menu-button'}> Overview</Button></NavLink>
      <NavLink to='/budget' className='nav-link'><Button variant='contained' className={pathname === '/budget' ? 'selected-menu-btn' : 'menu-button'}>Budget</Button></NavLink>
      <NavLink to='/transactions' className='nav-link'><Button variant='contained' className={pathname === '/transactions' ? 'selected-menu-btn' : 'menu-button'}>Transactions</Button></NavLink>
      <NavLink to='/reports' className='nav-link'><Button variant='contained' className={pathname === '/reports' ? 'selected-menu-btn' : 'menu-button'}>Reports</Button></NavLink>
      <NavLink to='/accounts' className='nav-link'><Button variant='contained' className={pathname === '/accounts' ? 'selected-menu-btn' : 'menu-button'}>Accounts</Button></NavLink>
    </Fragment>
  )

  return <AppBar position='static' className='hide-on-small hide-on-medium'>
      <Toolbar>
        <Typography color='inherit' style={{ flex: 1 }}>
          {leftButtons}
        </Typography>
          <NavLink to='/settings' className='nav-link'><Button variant='contained' className={pathname === '/settings' ? 'selected-menu-btn' : 'menu-button'}>Settings</Button></NavLink>
      </Toolbar>
    </AppBar>
}

export function TopBar(props: TopBarProps)  {
    useEffect(() => {
        props.loadCurrencyList();
        props.loadSettingList();
        props.loadTagList();
        props.loadRatesList();
    }, []);
    return <Fragment>
        <PrimaryTopBar />
        <SmallTopBar />
      </Fragment>
}

export default TopBar;
