const { createApp } = Vue;

createApp({
    data() {
        return {
            currentTime: '',
            isAvailable: false,
            statusText: '',
            countdownText: '',
            loading: false,
            streamUrl: '',
            currentStreamName: '',
            hls: null,
            errorMessage: '',
            schedule: STREAM_CONFIG.schedule,
            ui: STREAM_CONFIG.ui,
            corsProxy: 'https://cors-anywhere.herokuapp.com/',
            availableStreams: {}
        }
    },
    
    mounted() {
        // 初始化
        
        // 初始化直播源配置
        this.initializeStreams();
        
        // 检查URL参数（仅用于调试，生产环境建议移除）
        const urlParams = new URLSearchParams(window.location.search);
        const debugStream = urlParams.get('debug');
        if (debugStream) {
            this.streamUrl = decodeURIComponent(debugStream);
            this.currentStreamName = 'debug';
            console.log('调试模式：使用URL参数中的直播源');
        }
		this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    },
    
    methods: {
        initializeStreams() {
            // 构建可用的直播源列表
            this.availableStreams = {};
            
            // 添加主要直播源
            if (STREAM_CONFIG.primaryStream) {
                this.availableStreams['primary'] = STREAM_CONFIG.primaryStream;
            }
            
            // 添加备用直播源
            if (STREAM_CONFIG.backupStream) {
                this.availableStreams['backup'] = STREAM_CONFIG.backupStream;
            }
            
            // 添加多直播源配置
            if (typeof STREAM_SOURCES !== 'undefined') {
                Object.assign(this.availableStreams, STREAM_SOURCES);
            }
            
            // 设置默认直播源
            if (Object.keys(this.availableStreams).length > 0) {
                const firstStreamName = Object.keys(this.availableStreams)[0];
                this.streamUrl = this.availableStreams[firstStreamName];
                this.currentStreamName = firstStreamName;
            }
        },
        
        switchStream(streamName, streamUrl) {
            if (this.currentStreamName === streamName) {
                return; // 已经是当前直播源，无需切换
            }
            
            console.log(`切换到直播源: ${streamName}`);
            
            // 停止当前直播
            this.stopStream();
            
            // 设置新的直播源
            this.currentStreamName = streamName;
            this.streamUrl = streamUrl;
            
            // 如果当前在直播时间内，立即开始新的直播
            if (this.isAvailable) {
                this.startStream();
            }
        },
        
        getStreamDisplayName(streamName) {
            // 优先使用配置文件中的自定义显示名称
            if (typeof STREAM_DISPLAY_NAMES !== 'undefined' && STREAM_DISPLAY_NAMES[streamName]) {
                return STREAM_DISPLAY_NAMES[streamName];
            }
            
            // 使用默认显示名称
            const displayNames = {
                'primary': '📺 主直播源',
                'backup': '🔄 备用直播源',
                'classroom1': '🏫 教室1',
                'classroom2': '🏫 教室2',
                'classroom3': '🏫 教室3',
                'playground': '🏃 操场',
                'auditorium': '🎭 礼堂',
                'library': '📚 图书馆',
                'gym': '🏀 体育馆',
                'cafeteria': '🍽️ 食堂',
                'ceremony': '🎓 毕业典礼',
                'sports': '⚽ 运动会',
                'concert': '🎵 音乐会',
                'debug': '🔧 调试模式'
            };
            
            return displayNames[streamName] || `📺 ${streamName}`;
        },
        
        updateTime() {
            const now = new Date();
            
            // 格式化时间显示
            this.currentTime = now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: this.ui.timezone
            });
            
            // 检查是否在允许的时间段内
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentMinutes = hours * 60 + minutes;
            const startMinutes = this.schedule.startHour * 60 + this.schedule.startMinute;
            const endMinutes = this.schedule.endHour * 60 + this.schedule.endMinute;
            
            const wasAvailable = this.isAvailable;
            this.isAvailable = currentMinutes >= startMinutes && currentMinutes < endMinutes;
            
            if (this.isAvailable) {
                this.statusText = '✅ 直播开放中';
                if (!wasAvailable && this.streamUrl) {
                    this.startStream();
                }
            } else {
                this.statusText = '❌ 直播已关闭';
                if (wasAvailable) {
                    this.stopStream();
                }
                this.updateCountdown(currentMinutes, startMinutes, endMinutes);
            }
        },
        
        updateCountdown(currentMinutes, startMinutes, endMinutes) {
            let targetMinutes;
            let prefix;
            
            if (currentMinutes < startMinutes) {
                // 等待开始
                targetMinutes = startMinutes;
                prefix = '距离直播开始还有：';
            } else {
                // 等待明天开始
                targetMinutes = startMinutes + 24 * 60;
                prefix = '距离明天直播还有：';
            }
            
            const diffMinutes = targetMinutes - currentMinutes;
            const hours = Math.floor(diffMinutes / 60);
            const minutes = diffMinutes % 60;
            
            this.countdownText = `${prefix}${hours}小时${minutes}分钟`;
        },
        
        startStream() {
            if (!this.streamUrl) {
                this.errorMessage = '未配置直播源地址，请检查config.js文件';
                return;
            }
            
            this.loading = true;
            this.errorMessage = '';
            const video = this.$refs.videoPlayer;
            
            // 处理HTTPS/HTTP混合内容问题
            let processedUrl = this.streamUrl;
            if (window.location.protocol === 'http:' && this.streamUrl.startsWith('https://')) {
                processedUrl = this.corsProxy + this.streamUrl;
                console.log('使用CORS代理处理HTTPS直播源');
            }
            
            if (Hls.isSupported()) {
                this.hls = new Hls({
                    debug: false,
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90,
                    xhrSetup: (xhr, url) => {
                        xhr.withCredentials = false;
						xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.60(0x18003c32) NetType/4G Language/zh_CN miniProgram/wxb2ef61a897ab2cb0');
                    }
                });
                
                this.hls.loadSource(processedUrl);
                this.hls.attachMedia(video);
                
                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    this.loading = false;
                    video.play().catch(e => {
                        console.log('自动播放被阻止，需要用户交互');
                        video.muted = true;
                        return video.play();
                    });
                });
                
                this.hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS错误:', data);
                    this.loading = false;
                    
                    if (data.fatal) {
                        switch(data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                this.errorMessage = '网络连接失败，请检查网络或直播源地址';
                                this.hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                this.errorMessage = '媒体播放错误，正在尝试恢复...';
                                this.hls.recoverMediaError();
                                break;
                            default:
                                this.errorMessage = '直播加载失败，请刷新页面重试';
                                this.hls.destroy();
                                this.hls = null;
                                break;
                        }
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Safari原生支持
                video.src = processedUrl;
                video.addEventListener('loadedmetadata', () => {
                    this.loading = false;
                    video.play().catch(e => {
                        console.log('Safari自动播放被阻止:', e);
                        this.errorMessage = '播放失败，请点击播放按钮';
                    });
                });
                
                video.addEventListener('error', (e) => {
                    console.error('Safari视频错误:', e);
                    this.loading = false;
                    this.errorMessage = '直播加载失败，请检查直播源地址';
                });
            } else {
                this.errorMessage = '您的浏览器不支持HLS直播';
                this.loading = false;
            }
        },
        
        stopStream() {
            if (this.hls) {
                this.hls.destroy();
                this.hls = null;
            }
            
            const video = this.$refs.videoPlayer;
            if (video) {
                video.pause();
                video.src = '';
            }
            this.errorMessage = '';
        },
        
        handleVideoError() {
            console.error('视频播放错误');
            this.loading = false;
            this.errorMessage = '视频播放出错，请刷新页面重试';
        }
    }
}).mount('#app');
