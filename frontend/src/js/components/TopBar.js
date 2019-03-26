import React, {Component, Fragment} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default class TopBar extends Component {
    state = {
        anchorEl: null,
    };

    componentDidMount() {
        this.props.currencyActions.loadCurrencyList();
        this.props.settingActions.loadSettingList();
        this.props.budgetActions.loadBudgetList();
        this.props.tagActions.loadTagList();
        this.props.rateActions.loadRatesList()
    }

    openMenu(event){
        this.setState({anchorEl: event.currentTarget});
    }


    setPath = function (path) {
        this.props.push(path);
        this.setState({anchorEl: null})
    };

    setSelectedStyle(path) {
        if (this.props.path == path) {
            return 'outlined'
        }
        else {
            return 'text'
        }
    }

    primaryTopBar() {
        var leftButtons = (
            <Fragment>
                <Button onClick={() => ::this.setPath('/')} variant={::this.setSelectedStyle('/')}
                        color='inherit'>Overview</Button>
                <Button onClick={() => ::this.setPath('/budget')} variant={::this.setSelectedStyle('/budget')}
                        color='inherit'>Budget</Button>
                <Button onClick={() => ::this.setPath('/transactions')}
                        variant={::this.setSelectedStyle('/transactions')} color='inherit'>Transactions</Button>
                <Button onClick={() => ::this.setPath('/reports')} variant={::this.setSelectedStyle('/reports')}
                        color='inherit'>Reports</Button>
                <Button onClick={() => ::this.setPath('/accounts')} variant={::this.setSelectedStyle('/accounts')}
                        color='inherit'>Accounts</Button>
            </Fragment>
        );

        var rightButtons = (
            <Fragment>
                <Button onClick={() => ::this.setPath('/settings')} variant={::this.setSelectedStyle('/settings')}
                        color='inherit'>Settings</Button>
            </Fragment>
        );
        return (
            <AppBar position='static' className='hide-on-small'>
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
        return (<AppBar position='static' className='hide-on-medium'>
            <Toolbar>
                <IconButton color='inherit' aria-label='Menu' onClick={::this.openMenu}>
                    <MenuIcon/>
                </IconButton>
                <Button variant='outlined' color='inherit'>{currentPage}</Button>
            </Toolbar>
            <Menu id='top-small-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
                <MenuItem onClick={() => ::this.setPath('/')}>Overview</MenuItem>
                <MenuItem onClick={() => ::this.setPath('/budget')}>Budget</MenuItem>
                <MenuItem onClick={() => ::this.setPath('/transactions')}>Transactions</MenuItem>
                <MenuItem onClick={() => ::this.setPath('/reports')}>Reports</MenuItem>
                <MenuItem onClick={() => ::this.setPath('/accounts')}>Accounts</MenuItem>
                <MenuItem onClick={() => ::this.setPath('/settings')}>Settings</MenuItem>
            </Menu>
        </AppBar>)
    }

    render() {
        var mainTopBar = this.primaryTopBar();
        var smallTopBar = this.smallTopBar();

        return (
            <Fragment>
                {mainTopBar}
                {smallTopBar}
            </Fragment>
        )
    }
}
