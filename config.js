// 直播源配置文件
// 将此文件中的直播源地址修改为您的实际地址

const STREAM_CONFIG = {
    // 主要直播源地址（必填）
    primaryStream: 'https://example.com/live/stream.m3u8',
    
    // 备用直播源地址（可选）
    backupStream: '',
    
    // 直播时间段设置
    schedule: {
        startHour: 8,
        startMinute: 30,
        endHour: 15,
        endMinute: 30
    },
    
    // 界面设置
    ui: {
        title: '📹 学校直播',
        subtitle: '优化设计的直播界面',
        timezone: 'Asia/Shanghai'
    }
};

// 多个直播源配置
// 直播源地址将在部署时通过GitHub Secrets自动替换
const STREAM_SOURCES = {
    // 教室直播源
    classroom1: '{{CLASSROOM1_URL}}',
    classroom2: '{{CLASSROOM2_URL}}'
};

// 直播源显示名称配置（可选）
// 如果不配置，将使用默认的显示名称
const STREAM_DISPLAY_NAMES = {
    classroom1: '🏫 教室一',
    classroom2: '🏫 教室二'
};
