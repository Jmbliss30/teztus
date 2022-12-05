import { Col, Container, Row, Button, Modal, ProgressBar, Form } from 'react-bootstrap';
import React, { useState, useEffect, useRef } from 'react';
import FileBase64 from 'react-file-base64';
import '../../css/main.css';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hotkeys';
import 'videojs-markers';
import 'videojs-seek-buttons';
import 'videojs-offset';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getLoggedUser } from '../../helpers/utils';
import 'videojs-markers/dist/videojs.markers.css';
import 'videojs-seek-buttons/dist/videojs-seek-buttons.css';
import 'videojs-seek-buttons/dist/videojs-seek-buttons.min.js';
import '@videojs/themes/dist/sea/index.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const VideoPlayer = (props) => {
    const [postCourseModal, setpostCourseModal] = useState(false);
    const [courseVideos, setCourseVideos] = useState([]);
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [userId, setUserId] = useState('');
    const user = getLoggedUser();
    const navigate = useNavigate();
    const location = useLocation();
    let player;
    let pausedAt;

    const fetchUserId = async (email) => {
        try {
            const url = `${process.env.REACT_APP_BASE_URL}/api/users/email/` + email;
            const id = await axios.get(url);
            setUserId(id.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const episode = props.episode
        const topic = props.topic
        if (!topic || !episode) return
        setVideotoPath(episode);
        setTopicId(topic._id);
        setTopicDescription(topic.description);
        setVideoEpisode(topic.episodes);
        setMainTopic(topic);
        var player = playerRef.current;
        setvideoPlaying(true);
        setVideoDuration(episode.viewprogress);
        if (player) player.currentTime(episode.viewprogress);
      
    }, [props.topic, props.episode])
    
    useEffect(() => {
        if (!localStorage.getItem('jwt')) {
            navigate('/signin');
        }
        fetchUserId(user.email);
    }, []);
    var intervall;

    const VideoJS = (props) => {
        const { options, onReady, play, pause, on } = props;

        useEffect(() => {
            if (!playerRef.current) {
                const videoElement = videoRef.current;

                if (!videoElement) return;

                player = playerRef.current = videojs(videoElement, options, () => {
                    onReady && onReady(player);
                });
            } else {
            }
        }, [options, videoRef]);

        // Dispose the Video.js player when the functional component unmounts

        useEffect(() => {
            var player = playerRef.current;
            return () => {
                if (player) {
                    player.currentTime();
                    playerRef.current = null;
                }
            };
        }, [playerRef]);
        const query = new URLSearchParams(location.search);
        const Course_Title = query.get('title');

        const [notes, setNotes] = useState({
            time: props?.currentTime,
            text: ''
        });
        const handleSubmitNotes = (e) => {
            e.preventDefault();
            let PayLoad = {
                time: player?.currentTime(),
                text: notes.text,
                user: userId
            };
            videoPath.comments?.push(PayLoad);
            axios.put(`${process.env.REACT_APP_BASE_URL}/api/courses/${courseId}/${topicId}/${videoPath._id}/comment`, PayLoad);
            toast.success('Note Added!', {
                position: 'top-right',
                theme: 'colored',
                autoClose: 2000,
                hideProgressBar: false
            });
            setNotes({
                time: props.currentTime,
                text: ''
            });
        };

        return (
            <div data-vjs-player>
                <video ref={videoRef} id="ddd" className="video-js vjs-big-play-centered vjs-theme-sea" data-setup='{ "playbackRates": [0.5, 1, 1.5, 2] }' />
                <div className="topicdescription" style={{ minHeight: 'calc(100vh - 16px)', top:'0px' }}>
                    <h2>{Course_Title}</h2>
                    <h5>{videoPath?.title}</h5>
                    <p>{topicDescription}</p>
                </div>
                <div className="notes-icon">
                    <img src="../assets/Group 1000001708.png" onClick={() => openNavNote()} />
                    <img src="../assets/Group 446.png" onClick={openNav} />
                </div>

                <div className="next-icon" id="nxtepi" onClick={PlayingNextEpisode}>
                    <img src="../assets/skip-forward.svg" />
                </div>

                <div id="mySidenav" className="sidebar episode">
                    <a className="closebtn" onClick={closeNav}>
                        <img src="../assets/chevron-right.svg" alt="close" />
                    </a>
                    <p className="form-notes">Episodes</p>
                    {videoEpisode?.map((episode, i) => {
                        return (
                            <>
                                <p className="courname subtitle-epi" onClick={() => OpenModalPlayingSubVideo(episode)} key={i}>
                                    <p>
                                        <span className="pe-2">{i}</span>
                                        {episode.title}
                                    </p>
                                    <ProgressBar now={(episode.viewprogress / episode.totalEpisodeDuartion) * 100} className=" mt-2 courseprogress two-progress" style={{ height: '5px' }} />
                                </p>
                            </>
                        );
                    })}
                </div>
                <div id="mySidenavNote" className="sidebar episode notesform">
                    <a className="closebtn" onClick={closeNavNote}>
                        <img src="../assets/chevron-right.svg" alt="close" />
                    </a>
                    <p className="form-notes">Notes</p>
                    <Form onSubmit={handleSubmitNotes} className="course-form">
                        <Row className="mb-2">
                            <Form.Group as={Col} md="12" controlId="description" className="mb-2 position-relative">
                                <Form.Control name="time" type="hidden" placeholder="Time Stamp" value={player?.currentTime()} onChange={(e) => setNotes({ ...notes, time: e.target.value })} />
                            </Form.Group>

                            <Form.Group as={Col} md="12" controlId="description" className="my-2 position-relative">
                                <Form.Control as="textarea" rows={4} name="writeNote" maxLength="200" placeholder="Write a note" onChange={(e) => setNotes({ ...notes, text: e.target.value })} />
                            </Form.Group>
                        </Row>
                        <Button type="submit">Save Note</Button>
                    </Form>
                    <div className="notesadditiona">
                        {videoPath?.comments?.map((comment, i) => {
                            return (
                                <p className="mynotes" key={i}>
                                    {comment?.text}: ({comment?.time?.toFixed(1)})
                                </p>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // ------------------------- Episodes-----------
    function openNav() {
        if (document.getElementById('mySidenav').style.width == '340px') {
            document.getElementById('mySidenav').style.width = '0px';
        } else {
            document.getElementById('mySidenav').style.width = '340px';
            document.getElementById('mySidenavNote').style.width = '0px';
        }
    }
    function closeNav() {
        document.getElementById('mySidenav').style.width = '0px';
    }
    // ----------------- Notes ------------------

    const openNavNote = () => {
        if (document.getElementById('mySidenavNote').style.width == '340px') {
            document.getElementById('mySidenavNote').style.width = '0px';
        } else {
            document.getElementById('mySidenavNote').style.width = '340px';
            document.getElementById('mySidenav').style.width = '0px';
        }

        // setCurrentTime(player?.currentTime());
    };
    function closeNavNote() {
        document.getElementById('mySidenavNote').style.width = '0px';
    }

    // var player = videojs('newvideos');
    const videoJsOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        plugins: {
            markers: {
                markers: [],
                breakOverlay: {
                    display: false
                }
            },

            hotkeys: {
                volumeStep: 0.1,
                seekStep: 5,
                enableModifiersForNumbers: false
            }
        }
    };
    const handleStart = () => {
        var player = playerRef.current;
        intervall = setInterval(() => {
            if (player) {
                let payload = {
                    courseId: courseId,
                    topicId: topicId,
                    videoPath: videoPath._id,
                    totalEpisodeDuartion: player.duration(),
                    viewprogress: player.currentTime()
                };
                axios.put(`${process.env.REACT_APP_BASE_URL}/api/courses/${courseId}/${topicId}/${videoPath._id}/duration`, payload);
            }

            // clearInterval(intervall);
        }, 3000);
    };
    const handleReset = () => {
        clearInterval(intervall); // increment is undefined
    };
    useEffect(() => {
        handleStart();
    }, []);

    const handlePlayerReady = (player) => {
        playerRef.current = player;
        player.on('waiting', () => {});

        player.on('dispose', () => {});

        player.on('pause', () => {
            handleReset();
            pausedAt = player.currentTime() < player.duration() ? player.currentTime() : 0;
            let payload = {
                courseId: courseId,
                topicId: topicId,
                videoPath: videoPath._id,
                totalEpisodeDuartion: player.duration(),
                viewprogress: player.currentTime()
            };
            axios.put(`${process.env.REACT_APP_BASE_URL}/api/courses/${courseId}/${topicId}/${videoPath._id}/duration`, payload);
        });
        document.getElementById('nxtepi').style.display = 'none';
        player.on('play', () => {
            handleStart();
 var element1 = document.getElementById('thiPlayingvideo');
 element1.classList.add('videoplayingbg');
            document.getElementById('nxtepi').style.display = 'block';
            if (pausedAt) {
                player.currentTime(pausedAt);
            } else if (videoDuration < player.duration()) {
                player.currentTime(videoDuration);
            } else {
                player.currentTime(0);
            }

            pausedAt = '';
        });
    };

    const [toggle, setToggle] = useState(false);
    const { courseId } = useParams();
    const getCourses = async () => {
        let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/courses/${courseId}`);
        try {
            setCourseVideos(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    const [videoEpisode, setVideoEpisode] = useState();
    const [videoPath, setVideotoPath] = useState({});
    const [videoPlaying, setvideoPlaying] = useState(false);
    useEffect(() => {
        getCourses();
    }, [toggle, videoPlaying]);
 

    const [topicId, setTopicId] = useState();

    const [topicDescription, setTopicDescription] = useState();

    const [videoDuration, setVideoDuration] = useState();
    const [mainTopic, setMainTopic] = useState();

    const PlayingNextEpisode = async () => {
        const index = videoEpisode.findIndex((id) => id._id == videoPath._id);
        if (index < videoEpisode.length - 1) {
            setVideotoPath(videoEpisode[index + 1]);
            let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/courses/${courseId}`);
            try {
                if (res.data) {
                    let filterData = res.data.topics?.filter((id) => id._id == mainTopic._id);

                    if (filterData.length) {
                        setVideoEpisode(filterData[0].episodes);
                    } else setMainTopic(mainTopic);
                }
            } catch (error) {
                console.log(error);
            }
        } else document.getElementById('nxtepi').style.pointerEvents = 'none';
        setToggle(!toggle);
    };
    const OpenModalPlayingSubVideo = async (episode) => {
        setVideotoPath(episode);
        setTopicId(mainTopic._id);
        setTopicDescription(mainTopic.description);
        var player = playerRef.current;
        setVideoDuration(episode.viewprogress);
        player.currentTime(episode.viewprogress);
        player.on('play', function () {
            player.currentTime(episode.viewprogress);
           var element1 =document.getElementById('thiPlayingvideo')
            element1.classList.add('videoplayingbg');
            // element.classList.remove('class-3');
        });
        let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/courses/${courseId}`);
        try {
            if (res.data) {
                let filterData = res.data.topics?.filter((id) => id._id == mainTopic._id);

                if (filterData.length) {
                    setVideoEpisode(filterData[0].episodes);
                } else setMainTopic(mainTopic);
            }
        } catch (error) {
            console.log(error);
        }
    };
    



    return (
        <Modal {...props} fullscreen={true} aria-labelledby="contained-modal-title-vcenter" id="thiPlayingvideo" className="course-Modal videomodal px-0" centered>
            <Modal.Header closeButton>{/* <img src="../assets/file-text.svg" className="notesmodal-btn" onClick={() => OpenModalNotesForm()} /> */}</Modal.Header>
            <Modal.Body className="p-0">
                <Container fluid>
                    <Row>
                        <Col xs={12} className="p-0">
                            <VideoJS
                                options={{
                                    ...videoJsOptions,

                                    plugins: {
                                        ...videoJsOptions.plugins,
                                        markers: {
                                            markers: videoPath?.comments?.map((comment) => {
                                                return comment;
                                            })
                                        },
                                        seekButtons: {
                                            forward: 5,
                                            back: 5
                                        }
                                    },
                                    sources: [
                                        {
                                            src: `${process.env.REACT_APP_BASE_URL}/videos${videoPath?.path}`,
                                            type: 'video/mp4'
                                        }
                                    ]
                                }}
                                onReady={handlePlayerReady}
                            />
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default VideoPlayer;
