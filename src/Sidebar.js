import React,{useState,useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import db from './firebase';
import SidebarTeam from './SidebarTeam';
import {useParams} from 'react-router-dom';
import {Avatar} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import notify from './toaster';
import {Link} from 'react-router-dom'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    width:'100%',
    flexGrow: 1,
    maxWidth:360,
    position: 'relative'
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  appBar: {
    background: '#dc3545',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  title: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function Sidebar() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [teams, setTeams] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);
    const [openTopMenu, setOpenTopMenu] = useState(false);
    const {roomId, teamId,teamName} = useParams();
    const id = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const user = JSON.parse(localStorage.getItem('user'));


    useEffect(() => {
        setOpen(false);
    },[teamName]);

    useEffect(() => {
        async function Call(){
            if(email){
                const citiesRef = db.collection('users');
                const snapshot = await citiesRef.where('email', '==', email).get();
                if (snapshot.empty) {
                console.log('No matching documents.');
                }  else {
                snapshot.forEach(doc => {
                db.collection('users').doc(doc.id).collection('groups').onSnapshot((snapshot) => {
                    setTeams(snapshot.docs.map(docss => (
                        {
                            id: docss.id,
                            data: docss.data(),
                        }
                    )))
                    });
                });
            }
        }
        }
        Call();
      },[id]);
  
    const createTeam =  () => {
        let team_id = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
        let team_name = prompt("enter team name");
        setOpenTopMenu(false);
        if(id && team_name){
            db.collection('users').doc(id).collection('groups').add({
                name: team_name.toUpperCase(),
                id: team_id.toUpperCase()
            });
            db.collection('teamid').add({
                id: team_id.toUpperCase(),
                name: team_name.toUpperCase(),
            }).then(function(docRef) {
                db.collection('teamid').doc(docRef.id).collection('members').add({
                    name: user.displayName,
                }).then(function(res) {
                    if(res.id){
                        notify('Team Created Successfully','info');
                    } else {
                        notify('Team Not Created','error');
                    }
                })
            });
        } else {
            notify('Error Occured', 'error');
        }
    }

    const joinTeam = async () => {
        let team_id = prompt("enter team id");
        let team_name = prompt("enter team name");

        const check =await db.collection('teamid').where('id','==',team_id).get();
        if(check.empty){
            alert('enter correct team id');
        } else {
            db.collection('users').doc(id).collection('groups').add({
                name: team_name.toUpperCase(),
                id: team_id.toUpperCase()
            });
            check.forEach((item) => {
                db.collection('teamid').doc(item.id).collection('members').add({
                    name: user.displayName
                }).then(function(res) {
                    if(res.id){
                        notify('Team Joined Successfully','info');
                    } else {
                        notify('Error Occured','error');
                    }
                })
            })
            
        }  
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleCloseMenu = () => {
        setOpenMenu(!setOpen);
    }

    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }

    const handleOpenTopMenu = () => {
        setOpenTopMenu(!openTopMenu);
    }

    return (
        <div className={classes.root}>
        <CssBaseline />
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
            })}
        >
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
            >
                <MenuIcon />
            </IconButton>
                <Typography variant="h6" noWrap className={classes.title}>
                    Khata Book
                </Typography>
            {true && (
                <div>
                <IconButton aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenTopMenu} color="inherit">
                    <MoreVertIcon />
                </IconButton>
                <Menu 
                getContentAnchorEl={null} 
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }} 
                id="simple-menu" 
                keepMounted 
                open={openTopMenu} 
                onClose={handleOpenTopMenu}>
                    <MenuItem onClick={createTeam}>Create Team</MenuItem>
                    <MenuItem onClick={joinTeam}>Join Team</MenuItem>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
                </div>
            )}
            </Toolbar>
        </AppBar>
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
            paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <Avatar src={user?.photoURL} className="Avatar" />
                <Link to={`/dashboard`}><h2 className={classes.userName}>{user?.displayName}</h2></Link>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
            <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
                {teams.map(team => (
                        <SidebarTeam user_id={id} key={team.id} id={team.id} team_id={team.data.id} team_name={team.data.name} />
                ))}
            </List>
        </Drawer>
        </div>
    );
}
