import type { Customer, Solution, ChooseReason, CommunityLink, ContributeLink } from "@/types"
import { getEntries } from "astro:content";

// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// TODO: 配置algolia
export const ALGOLIA = {
  appId: '1QV814950M',
  apiKey: '7445da3dec050d45d29f3fe93ed45af3',
  indexName: 'nacos'
}

// 文档根据版本区分的提示banner
export const DOCS_BANNER = {
  latest: '',
  next: '',
  v1: '',
  v2: '',
}

// TODO: 文档Header数据
export const DOCS_ITEM = [
  {
    key: "2023",
    label: "2023.0.x",
    target: "_self",
    link: "/docs/2023/overview/what-is-sca/",
    translations: {
      en: "2023.0.x",
      link: "/en/docs/2023/overview/what-is-sca/",
    }
  },
  {
    key: "2022",
    label: "2022.0.x",
    target: "_self",
    link: "/docs/2022/overview/what-is-sca/",
    translations: {
      en: "2022.0.x",
      link: "/en/docs/2022/overview/what-is-sca/",
    }
  },
  {
    key: "2021",
    label: "2021.0.x",
    target: "_self",
    link: "/docs/2021/overview/what-is-sca/",
    translations: {
      en: "2021.0.x",
      link: "/en/docs/2021/overview/what-is-sca/",
    }
  },
  {
    key: "2.2.x",
    label: "2.2.x",
    target: "_self",
    link: "/docs/2.2.x/overview/what-is-sca/",
    translations: {
      en: "2.2.x",
      link: "/en/docs/2.2.x/overview/what-is-sca/",
    }
  },
];

// 主要特性
export const CHOOSE_REASON_LIST: ChooseReason[] = [
  {
    title: "home.website.edge.1.title",
    svgKey: "easy",
    description: "home.website.edge.1.description",
  },
  {
    title: "home.website.edge.2.title",
    svgKey: "adaptive",
    description: "home.website.edge.2.description",
  },
  {
    title: "home.website.edge.3.title",
    svgKey: "timeTested",
    description: "home.website.edge.3.description",
  },
  {
    title: "home.website.edge.4.title",
    svgKey: "variety",
    description: "home.website.edge.4.description",
  },
]

// 合作客户反馈
export const COMPANY_CUSTOMERS: Customer[] = [
  {
    name: "cloud.feedback.soul.name",
    theme: "gray",
    logo: "https://img.alicdn.com/imgextra/i2/O1CN01GZhEqR1bY3dY5SOuY_!!6000000003476-2-tps-160-130.png",
    href: "https://code.alibaba-inc.com/goat/astro-nacos",
    description: "cloud.feedback.soul.description",
  },
  {
    name: "cloud.feedback.laidian.name",
    theme: "dark",
    logo: "https://img.alicdn.com/imgextra/i3/O1CN010ulPrT1M45UNBCAXe_!!6000000001380-2-tps-160-130.png",
    href: "https://developer.aliyun.com/article/855894",
    description: "cloud.feedback.laidian.description",
  },
  {
    name: "cloud.feedback.zeekr.name",
    theme: "light",
    logo: "https://img.alicdn.com/imgextra/i2/O1CN01zluUCK29BKvOCojPr_!!6000000008029-2-tps-160-130.png",
    href: "https://developer.aliyun.com/article/1173573",
    description: "cloud.feedback.zeekr.description",
  },
  {
    name: "cloud.feedback.ykc.name",
    theme: "gray",
    logo: "https://img.alicdn.com/imgextra/i1/O1CN01LWMfwx1Ggf9VGmXBF_!!6000000000652-2-tps-160-130.png",
    href: "https://developer.aliyun.com/article/1172572?groupCode=mse",
    description: "cloud.feedback.ykc.description",
  },
  {
    name: "cloud.feedback.bosideng.name",
    theme: "dark",
    logo: "https://img.alicdn.com/imgextra/i2/O1CN01d7EDXs1HLsnXSTgGG_!!6000000000742-2-tps-160-130.png",
    href: "https://developer.aliyun.com/article/1147221?groupCode=mse",
    description: "cloud.feedback.bosideng.description",
  },
  {
    name: "cloud.feedback.skechers.name",
    theme: "light",
    logo: "https://img.alicdn.com/imgextra/i1/O1CN01P1k9gA1YpVsxPYzAw_!!6000000003108-2-tps-160-130.png",
    href: "https://developer.aliyun.com/article/844814",
    description: "cloud.feedback.skechers.description",
  },
  {
    name: "cloud.feedback.very.name",
    theme: "gray",
    logo: "https://img.alicdn.com/imgextra/i1/O1CN01DevTFA28W7HY1JFC6_!!6000000007939-2-tps-160-130.png",
    href: "https://developer.aliyun.com/article/992090",
    description: "cloud.feedback.very.description",
  },
  {
    name: "cloud.feedback.helian.name",
    theme: "dark",
    logo: "https://img.alicdn.com/imgextra/i3/O1CN01YmUBmh1snwqr4kRot_!!6000000005812-2-tps-544-180.png",
    href: "https://developer.aliyun.com/article/1095573",
    description: "cloud.feedback.helian.description",
  },
  {
    name: "cloud.feedback.zhijin.name",
    theme: "light",
    logo: "https://img.alicdn.com/imgextra/i3/O1CN015GIqM31qsPTObt2CV_!!6000000005551-2-tps-544-180.png",
    href: "https://developer.aliyun.com/article/1064881",
    description: "cloud.feedback.zhijin.description",
  },
];

// 解决方案列表
export const SOLUTION_LIST: Solution[] = [
  {
    checked: true,
    src: "https://help.aliyun.com/zh/mse/user-guide/implement-an-end-to-end-canary-release-by-using-mse-cloud-native-gateways",
    title: "home.solutions.card.1",
    keyword: [
      "home.solutions.card.keyword.high_availability",
      "home.solutions.card.keyword.grayscale_publishing",
      "home.solutions.card.keyword.eliminating_change_risks",
      "home.solutions.card.keyword.service_governance"
    ],
  },
  {
    checked: false,
    src: "https://developer.aliyun.com/article/1128388",
    title: "home.solutions.card.2",
    keyword: [
      "home.solutions.card.keyword.current_limiting_degradation",
      "home.solutions.card.keyword.high_availab",
      "home.solutions.card.keyword.great_promotion_of_stability",
      "home.solutions.card.keyword.eliminating_runtime_risks"
    ],
  },
  {
    checked: false,
    src: "https://developer.aliyun.com/article/1265016?spm=5176.21213303.J_qCOwPWspKEuWcmp8qiZNQ.10.c89e2f3dQa2WtF&scm=20140722.S_community@@%E6%96%87%E7%AB%A0@@1265016._.ID_community@@%E6%96%87%E7%AB%A0@@1265016-RL_%E4%BA%91%E5%8E%9F%E7%94%9F%E7%BD%91%E5%85%B3%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E5%AE%89%E5%85%A8%E9%98%B2%E6%8A%A4%E8%83%BD%E5%8A%9B-LOC_llm-OR_ser-V_3-RK_rerank-P0_2",
    title: "home.solutions.card.3",
    keyword: [
      "home.solutions.card.keyword.three_in_one",
      "home.solutions.card.keyword.safety",
      "home.solutions.card.keyword.plugin_ecosystem",
      "home.solutions.card.keyword.application_firewall",
    ],
  },
  {
    checked: false,
    src: "https://help.aliyun.com/zh/mse/use-cases/implement-graceful-start-and-shutdown-of-microservice-applications-by-using-mse/?spm=a2c4g.11186623.0.0.385116bftBJhAY",
    title: "home.solutions.card.4",
    keyword: [
      "home.solutions.card.keyword.lossless",
      "home.solutions.card.keyword.multi_availability",
      "home.solutions.card.keyword.grayscale",
      "home.solutions.card.keyword.service_governance",
    ],
  },
];

// 文档贡献板块的链接列表
export const getCommunityLinkList = (t: Function): CommunityLink[] => [
  {
    href: `/blog`,
    text: t("rightSidebar.readBlog"),
    icon: "basil:document-outline",
  },
  {
    href: 'https://github.com/spring-cloud-alibaba-group/spring-cloud-alibaba-group.github.io/blob/develop-astro-sca/src/content/docs',
    text: t("rightSidebar.github"),
    icon: "ant-design:github-filled",
  },
];



// 文档社区板块的链接列表
export const getContributeLinkList = (lang: string, editHref: string, feedbackUrl: string, t: Function): ContributeLink[] => [
  {
    // href: `/${lang}/v2/contribution/contributing`,
    href: '/docs/developer/contributor-guide/new-contributor-guide_dev/',
    text: t("rightSidebar.contributorGuides"),
    depth: 2,
    icon: "tabler:book",
  },
  {
    href: editHref,
    text: t("rightSidebar.editPage"),
    depth: 2,
    icon: "tabler:pencil",
  },
  {
    href: feedbackUrl,
    text: t("rightSidebar.feedbackIssue"),
    depth: 2,
    icon: "ant-design:github-filled",
  },
];

export const i18nMap = {
  "home": {
    dynamic: 'home.article.dynamic',
    explore: 'home.article.explore',
    practice: 'home.article.practice',
    all: 'home.articles.all'
  },
  "blog": {
    article: 'blog.article.technical',
    case: 'blog.article.case.best.practices',
    ecosystem: 'blog.article.ecosystem.articles',
    all: 'blog.all.articles'
  },
  "news": {
    announcement: 'blog.activity.community.announcement',
    release: 'blog.activity.release.statement',
    committer: 'page.blog.news.personnel.promotion',
    cooperate: 'page.blog.news.community.cooperation',
    all: 'page.blog.news.all'
  },
  "activity": {
    'announcement': 'blog.activity.community.announcement',
    'activity-preview': 'blog.activity.preview.event',
    'activity-detail': 'blog.activity.detail.event',
    'all': 'blog.activity.all.event'
  },
  "learn": {
    'spring': 'learn.spring.title',
    'spring-boot': 'learn.spring-boot.title',
    'spring-cloud': 'learn.spring-cloud.title',
    'spring-cloud-alibaba': 'learn.spring-cloud-alibaba.title',
    'all': 'learn.all.title'
  },
  "wuyi": {
    'all': 'learn.all.title',
    'expertConsultation': 'wuyi.meet-professor.title',
  },
  "learning": {
    dynamic: 'learning.dynamic',
    explore: 'learning.explore',
    practice: 'learning.practice',
    all: 'learning.all'
  },
};

export const BLOG_CATEGORY = [
  {
    type: 'all',
    title: '全部文章',
    href: '/blog/'
  },
  {
    type: 'article',
    title: '技术文章',
    href: '/blog/article/'
  },

  {
    type: 'ecosystem',
    title: '生态文章',
    href: '/blog/ecosystem/'
  },
  {
    type: 'case',
    title: '最佳实践',
    href: '/blog/case/'
  },
];

export const LEARN_CATEGORY = [
  {
    type: 'all',
    title: '全部文章',
    href: '/learn/'
  },
  {
    type: 'spring',
    title: 'Spring',
    href: '/learn/spring/'
  },

  {
    type: 'spring-boot',
    title: 'Spring Boot',
    href: '/learn/spring-boot/'
  },
  {
    type: 'spring-cloud',
    title: 'Spring Cloud',
    href: '/learn/spring-cloud/'
  },
  {
    type: 'spring-cloud-alibaba',
    title: 'Spring Cloud Alibaba',
    href: '/learn/spring-cloud-alibaba/'
  },
];

export const WUYI_CATEGORY = [
  {
    type: 'expertConsultation',
    title: '全部文章',
    href: '/wuyi/'
  },
];

export const HEADER_ACTIVITY_CARD = [
  {
    "collection": "blog",
    "slug": "news/ospp-2024",
    "description": "Spring Cloud Alibaba 编程之夏报名启动！",
    "imageUrl": "https://img.alicdn.com/imgextra/i2/O1CN01Gh8wq71CApBVywPq3_!!6000000000041-0-tps-800-1000.jpg"
  },
  {
    "collection": "blog",
    "slug": "news/attend-a-meeting",
    "description": "参加社区双周会！",
    "imageUrl": "https://img.alicdn.com/imgextra/i2/O1CN01Gh8wq71CApBVywPq3_!!6000000000041-0-tps-800-1000.jpg"
  }
];

export const HEADER_LEARN_CARD = [
  {
    collection: "blog",
    slug: "learning/spring-boot/core",
    description: "最全面的 Spring 中文系列教程，从这里开启你的 Spring 应用开发之旅！",
    imageUrl:
      "https://img.alicdn.com/imgextra/i1/O1CN01xDVfHk1El7oBMjL3p_!!6000000000391-2-tps-1083-721.png",
  },
];

export const HEADER_SOLUTIONS_CARD = [
  {
    collection: "blog",
    slug: "release-nacos110",
    blankUrl: 'https://www.aliyun.com/product/aliware/mse',
    description: "阿里云 MSE 微服务引擎",
    imageUrl:
      "https://img.alicdn.com/imgextra/i2/O1CN011815Q71wQpLpuKYeC_!!6000000006303-0-tps-1284-721.jpg",
  },
];

export const BLOG_IMAGE_SOURCE = [
  "https://img.alicdn.com/imgextra/i1/O1CN0114MKuq1qKyZ0heOq7_!!6000000005478-2-tps-304-179.png",
  "https://img.alicdn.com/imgextra/i2/O1CN01E4YfjD1WmBmWymUJC_!!6000000002830-2-tps-608-358.png",
  "https://img.alicdn.com/imgextra/i1/O1CN01o9sjZA1Efd1bMrl0C_!!6000000000379-2-tps-608-358.png",
  "https://img.alicdn.com/imgextra/i1/O1CN011wgjV01CZ695M8OEB_!!6000000000094-2-tps-608-358.png",
  "https://img.alicdn.com/imgextra/i2/O1CN01swoIUH1csxKPKfwJE_!!6000000003657-2-tps-608-358.png",
  "https://img.alicdn.com/imgextra/i4/O1CN01nIy1Wf1DjSiy0TCxe_!!6000000000252-2-tps-608-358.png",
  "https://img.alicdn.com/imgextra/i3/O1CN019EjKf11Dj0KQKkP3e_!!6000000000251-2-tps-608-358.png",
  "https://img.alicdn.com/imgextra/i2/O1CN01l7gM7r1Y4L5ngHWb8_!!6000000003005-2-tps-608-358.png",
  "https://img.alicdn.com/imgextra/i2/O1CN01oWfLB51kfENwUFaQw_!!6000000004710-2-tps-608-358.png"
];

export const MICROSERVICE_SOLUTION = [
  { title: 'Nacos', image: '/assets/2-1.jpg', detailTitle: "home.introduction.detailTitle.1", detail: 'home.introduction.detail.1' },
  { title: 'Sentinel', image: '/assets/2-2.jpg', detailTitle: 'home.introduction.detailTitle.2', detail: 'home.introduction.detail.2' },
  { title: 'Seata', image: '/assets/2-3.jpg', detailTitle: 'home.introduction.detailTitle.3', detail: 'home.introduction.detail.3' },
  { title: 'RocketMQ', image: '/assets/2-4.jpg', detailTitle: 'home.introduction.detailTitle.4', detail: 'home.introduction.detail.4' },
  { title: 'AI', image: '/assets/2-5.jpg', detailTitle: 'home.introduction.detailTitle.5', detail: 'home.introduction.detail.5' },
  { title: 'Spring Boot', image: '/assets/2-6.jpg', detailTitle: 'home.introduction.detailTitle.6', detail: 'home.introduction.detail.6' },
  { title: 'Spring', image: '/assets/2-7.jpg', detailTitle: 'home.introduction.detailTitle.7', detail: 'home.introduction.detail.7' },
];

export const ProductDisplayCardData = [
  {
    cover: "https://img.alicdn.com/imgextra/i2/O1CN01psWBwW1tzgeAxapCz_!!6000000005973-0-tps-2448-3672.jpg",
    coverPosition: "bottom",
    title: "Nacos",
    body: "home.introduction.card.Nacos.des",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
  {
    cover: "https://img.alicdn.com/imgextra/i2/O1CN01l9eXcR1LJN7PxX79e_!!6000000001278-0-tps-1000-1500.jpg",
    coverPosition: "bottom",
    title: "RocketMQ",
    body: "home.introduction.card.RocketMQ.des",
    href: "docs/2023/user-guide/rocketmq/quick-start/",
  },
  {
    cover: "https://img.alicdn.com/imgextra/i2/O1CN01HzKXZY29J7h0UIGJ5_!!6000000008046-0-tps-1000-1500.jpg",
    coverPosition: "bottom",
    title: "Sentinel",
    body: "home.introduction.card.Sentinel.des",
    href: "docs/2023/user-guide/sentinel/quick-start/",
  },
  {
    cover: "https://img.alicdn.com/imgextra/i3/O1CN01bJroU81BzNHfeB3jN_!!6000000000016-0-tps-1000-1500.jpg",
    coverPosition: "bottom",
    title: "Seata",
    body: "home.introduction.card.Seata.des",
    href: "docs/2023/user-guide/seata/quick-start/",
  },
  {
    cover: "https://img.alicdn.com/imgextra/i2/O1CN01HzKXZY29J7h0UIGJ5_!!6000000008046-0-tps-1000-1500.jpg",
    coverPosition: "bottom",
    title: "Spring AI",
    body: "home.introduction.card.AI.des",
    href: "docs/2023/user-guide/ai/quick-start/",
  },
  {
    cover: "https://img.alicdn.com/imgextra/i2/O1CN01k1amBw1U0RHtPPlvH_!!6000000002455-0-tps-1000-1500.jpg",
    coverPosition: "bottom",
    title: "Spring Boot",
    body: "home.introduction.card.Boot.des",
    href: "/learn/spring-boot/",
  },
  {
    cover: "https://img.alicdn.com/imgextra/i3/O1CN01WxXILZ1C0I4pkZUyD_!!6000000000018-0-tps-1000-1500.jpg",
    coverPosition: "bottom",
    title: "Spring Cloud",
    body: "home.introduction.card.Cloud.des",
    href: "/learn/spring-cloud/",
  },
  {
    cover: "https://img.alicdn.com/imgextra/i1/O1CN01bKcEde1xVhBVptyhX_!!6000000006449-2-tps-1312-880.png",
    coverPosition: "bottom",
    title: "Spring Scheduling Tasks",
    body: "home.introduction.card.schedulerx.des",
    href: "docs/2023/user-guide/schedulerx/quick-start/",
  },
];

export const categoryMap = {
  article: "blog_article",
  case: "blog_case",
  ecosystem: "blog_ecosystem",
  release: "news_release",
  committer: "news_personnel",
  announcement: "news_announcement",
  cooperate: "news_cooperate",
  "activity-preview": "activity_activity-preview",
  "activity-detail": "activity_activity-preview",
};

//获取顶部导航悬浮层 博客列表信息
export const getBlogContentList = async (blogList = []) => {

  const simplifiedPosts = blogList.map((item) => ({
    collection: item.collection,
    slug: item.slug,
  }));
  const blogDescrip = blogList.map((item) => item.description);

  const blogImgs = blogList.map((item) => item.imageUrl);
  const posts = (await getEntries(simplifiedPosts as any)) || [];
  const blankUrl = blogList.map((item) => item.blankUrl);

  return {
    blogDescrip,
    blogImgs,
    posts,
    blankUrl
  };
}

export const COMMUNITY_MENU_LIST = [
  {
    label: "社区",
    translations: {
      en: "COMMUNITY",
    },
    children: [
      {
        label: "报告文档问题",
        target: "_blank",
        link: "https://github.com/spring-cloud-alibaba-group/spring-cloud-alibaba-group.github.io/issues",
        translations: {
          en: "Report a doc issue",
        },
      },
      {
        label: "贡献社区",
        target: "_blank",
        link: 'https://github.com/alibaba/spring-cloud-alibaba/pulls',
        translations: {
          en: "Contribute community",
        },
      },
      {
        label: "贡献者",
        target: "_blank",
        link: 'https://github.com/alibaba/spring-cloud-alibaba/graphs/contributors',
        translations: {
          en: "Contributors",
        },
      },
    ],
  },
  {
    label: "资源",
    translations: {
      en: "Resources",
    },
    children: [
      {
        label: "博客",
        target: "_self",
        link: "/blog/",
        translations: {
          en: "Blog",
        },
      },
      {
        label: "电子书",
        target: "_self",
        link: "/docs/ebook/srekog/",
        translations: {
          en: "E-book",
        },
      },
    ],
  },
];

export const LEARN_CARD_LIST = [
  {
    title: "commmon.header.spring.tutorial",
    description: "commmon.header.spring.tutorial.describe",
    href: "/learn/spring/",
  },
  {
    title: "commmon.header.spring.boot.tutorial",
    description: "commmon.header.spring.boot.tutorial.describe",
    href: "/learn/spring-boot/",
  },
  {
    title: "commmon.header.spring.cloud.alibaba.tutorial",
    description: "commmon.header.spring.cloud.alibaba.tutorial.describe",
    href: "/learn/spring-cloud/",
  },
  {
    title: "commmon.header.spring.mse.ebook",
    description: "commmon.header.spring.mse.ebook.describe",
    href: "/docs/ebook/srekog/",
  }
];

export const SOLUTIONS_CARD_LIST = [
  {
    title: "commmon.header.microservices.engine",
    description: "commmon.header.microservices.engine.describe",
    href: "https://help.aliyun.com/zh/mse/use-cases/implement-high-availability-capabilities-of-mse-microservices-registry?spm=a2c4g.11186623.0.0.102a27e0juv8vG",
  },
  {
    title: "commmon.header.microservices.cloud.native.gateway",
    description: "commmon.header.microservices.cloud.native.gateway.describe",
    href: "https://developer.aliyun.com/article/1265016?spm=5176.21213303.J_qCOwPWspKEuWcmp8qiZNQ.10.c89e2f3dQa2WtF&scm=20140722.S_community@@%E6%96%87%E7%AB%A0@@1265016._.ID_community@@%E6%96%87%E7%AB%A0@@1265016-RL_%E4%BA%91%E5%8E%9F%E7%94%9F%E7%BD%91%E5%85%B3%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E5%AE%89%E5%85%A8%E9%98%B2%E6%8A%A4%E8%83%BD%E5%8A%9B-LOC_llm-OR_ser-V_3-RK_rerank-P0_2",
  },
  {
    title: "commmon.header.microservices.governance",
    description: "commmon.header.microservices.governance.describe",
    href: "https://help.aliyun.com/zh/mse/use-cases/implement-an-end-to-end-canary-release-by-using-mse-cloud-native-gateways?spm=a2c4g.11186623.0.i3",
  },
  {
    title: "commmon.header.microservices.application.service",
    description: "commmon.header.microservices.application.service.describe",
    href: "https://help.aliyun.com/zh/arms/?spm=5176.8140086.J_5253785160.8.3e87be45mtM0kX",
  },
];

// 热门教程
export const HOT_TUTORIALDATA = [
  {
    img: "https://img.alicdn.com/imgextra/i1/O1CN01Vlprkg1r3rR2EBRc0_!!6000000005576-2-tps-196-280.png",
    title: "Apache RocketMQ 云原生统一消息引擎",
    href: "https://developer.aliyun.com/ebook/8122?spm=5176.28426678.J_HeJR_wZokYt378dwP-lLl.38.6f2051814wrfox&scm=20140722.S_community@@%E7%94%B5%E5%AD%90%E4%B9%A6@@8122._.ID_8122-RL_ApacheRocketMQ-LOC_search~UND~community~UND~item-OR_ser-V_3-P0_0",
    target: "_blank"
  },
  {
    img: "https://img.alicdn.com/imgextra/i2/O1CN01tTadKz29AsaUxDMKK_!!6000000008028-2-tps-196-280.png",
    title: "Apache RocketMQ 从入门到实战",
    href: "https://developer.aliyun.com/ebook/361?spm=5176.28426678.J_HeJR_wZokYt378dwP-lLl.46.6f2051814wrfox&scm=20140722.S_community@@%E7%94%B5%E5%AD%90%E4%B9%A6@@361._.ID_361-RL_ApacheRocketMQ-LOC_search~UND~community~UND~item-OR_ser-V_3-P0_2",
    target: "_blank"
  },
  {
    img: "https://img.alicdn.com/imgextra/i1/O1CN01vh3kef1ToX111kQat_!!6000000002429-2-tps-196-280.png",
    title: "Apache RocketMQ 源码解析",
    href: "https://developer.aliyun.com/ebook/363?spm=5176.28426678.J_HeJR_wZokYt378dwP-lLl.42.6f2051814wrfox&scm=20140722.S_community@@%E7%94%B5%E5%AD%90%E4%B9%A6@@363._.ID_363-RL_ApacheRocketMQ-LOC_search~UND~community~UND~item-OR_ser-V_3-P0_1",
    target: "_blank"
  },
  {
    img: "https://img.alicdn.com/imgextra/i1/O1CN01pifkKU1okVSyuzLzl_!!6000000005263-2-tps-196-280.png",
    title: "云原生消息队列Apache RocketMQ",
    href: "https://developer.aliyun.com/ebook/6677?spm=5176.28426678.J_HeJR_wZokYt378dwP-lLl.50.6f2051814wrfox&scm=20140722.S_community@@%E7%94%B5%E5%AD%90%E4%B9%A6@@6677._.ID_6677-RL_ApacheRocketMQ-LOC_search~UND~community~UND~item-OR_ser-V_3-P0_3",
    target: "_blank"
  },
];

// 最佳实践
export const PRACTICE_DATA = [
  {
    title: "RocketMQ x OpenTelemetry 分布式全链路追踪最佳实践",
    href: "/learning/bestPractice/rocketmq-opentelemetry/?source=home",
    img: "https://img.alicdn.com/imgextra/i4/O1CN01LR0Zkj1zyfMLasGa0_!!6000000006783-0-tps-685-383.jpg"
  },
  {
    title: "Apache RocketMQ  在阿里云大规模商业化实践之路",
    href: "/learning/bestPractice/apache-rocketmq-commercialization/?source=home",
    img: "https://img.alicdn.com/imgextra/i4/O1CN01ZYQ1XY1KBknq9j7MM_!!6000000001126-0-tps-685-383.jpg"
  },
];

// 最新公告
export const NEW_ANN_CONTENT = [
  {
    date: '7月26日',
    title: 'CommunityOverCode Asia 2024',
    content: 'Apache RocketMQ 邀您届时参与相关议题讨论和展位互动交流！',
    href: 'https://mp.weixin.qq.com/s/9JkzX1uXWdyJvGMhp06qRw',
    target: '_blank'
  },
  {
    date: '7月-11月',
    title: '开源之夏 2024',
    content: 'Apache RocketMQ 项目开发火热进行中',
    href: 'https://summer-ospp.ac.cn/org/orgdetail/ee35ab56-cc17-47bb-aa3f-25f786d23286?lang=zh',
    target: '_blank'
  },
  {
    date: '6月-8月',
    title: '2024 天池云原生编程挑战赛',
    content: '用通义灵码参与 Apache RocketMQ 开源贡献',
    href: 'https://tianchi.aliyun.com/competition/entrance/532215/information',
    target: '_blank'
  },
];

// 关注我们
export const FOLLOW_US_CONTENT = [
  {
    id: "qr1",
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01QxwNkn26nP3RQcFaA_!!6000000007706-2-tps-72-72.png',
    QRCode: 'https://img.alicdn.com/imgextra/i3/O1CN01yFNon31Jc235oP6nZ_!!6000000001048-0-tps-258-258.jpg',
    hoverIcon: 'https://img.alicdn.com/imgextra/i2/O1CN014LvJCV1kc1fbshQXu_!!6000000004703-2-tps-72-72.png',
  },
  {
    id: "qr2",
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01AIzwB41XdJmXKAJI0_!!6000000002946-2-tps-72-72.png',
    QRCode: 'https://img.alicdn.com/imgextra/i3/O1CN01D39bKU1tFQfcgmr97_!!6000000005872-2-tps-230-230.png',
    hoverIcon: 'https://img.alicdn.com/imgextra/i2/O1CN01zYNO3n1CFrZGXGbon_!!6000000000052-2-tps-72-72.png',
  },
  {
    id: "icon1",
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01wwWVab1qK3pKbYHYj_!!6000000005476-2-tps-72-72.png',
    link: 'https://www.zhihu.com/people/apache-rocketmq',
    hoverIcon: 'https://img.alicdn.com/imgextra/i1/O1CN01YLQXkG1gwOpDl38Mg_!!6000000004206-2-tps-72-72.png',
  },
  {
    id: "icon2",
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01YnWdvC1de8AyQYFM5_!!6000000003760-2-tps-72-72.png',
    link: 'https://space.bilibili.com/571603427',
    hoverIcon: 'https://img.alicdn.com/imgextra/i1/O1CN01DShl881C3xGmgeXUO_!!6000000000026-2-tps-72-72.png',
  },
  {
    id: "icon3",
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01QM8DZr1bCX51iuNSt_!!6000000003429-2-tps-72-72.png',
    link: 'https://segmentfault.com/u/shangqingdedigua',
    hoverIcon: 'https://img.alicdn.com/imgextra/i2/O1CN01SoZsj01ZG4uval8iQ_!!6000000003166-2-tps-72-72.png',
  },
  {
    id: "icon4",
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN018OsVSH27k1kYEolOg_!!6000000007834-2-tps-72-72.png',
    link: 'https://blog.csdn.net/ApacheRocketMQ',
    hoverIcon: 'https://img.alicdn.com/imgextra/i4/O1CN015EQmOx1mUofQ6SkZo_!!6000000004958-2-tps-72-72.png',
  },
  {
    id: "icon5",
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01ikDsZ129OA4WozOeT_!!6000000008057-2-tps-72-72.png',
    link: 'https://my.oschina.net/u/6179068',
    hoverIcon: 'https://img.alicdn.com/imgextra/i3/O1CN01GObEbt23XsmoukVzO_!!6000000007266-2-tps-72-72.png',
  },
  {
    id: "icon6",
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01939XVc1TgkHbCUmes_!!6000000002412-2-tps-72-72.png',
    link: 'https://developer.aliyun.com/group/rocketmq/',
    hoverIcon: 'https://img.alicdn.com/imgextra/i1/O1CN01yyJclV1uXZyviMuGS_!!6000000006047-2-tps-72-72.png',
  },
  {
    id: "icon7",
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01KOjZm820nxqQSLkLa_!!6000000006895-2-tps-72-72.png',
    link: 'https://www.infoq.cn/profile/EF01E8DEC6AAEE/publish',
    hoverIcon: 'https://img.alicdn.com/imgextra/i1/O1CN01LIS5BI25JnqJh6gwS_!!6000000007506-2-tps-72-72.png',
  },
  {
    id: "icon8",
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01dBlQj328LaEBJkFWg_!!6000000007916-2-tps-72-72.png',
    link: ' https://blog.51cto.com/u_15870054',
    hoverIcon: 'https://img.alicdn.com/imgextra/i1/O1CN01C1HTQC27BDeO4lb0Z_!!6000000007758-2-tps-72-72.png',
  },
];


// why learn
export const WHY_LEARN_LIST: ChooseReason[] = [
  {
    title: "home.why.item1.title",
    svgKey: "native",
    description: "home.why.item1.des",
  },
  {
    title: "home.why.item2.title",
    svgKey: "throughput",
    description: "home.why.item2.des",
  },
  {
    title: "home.why.item3.title",
    svgKey: "flow",
    description: "home.why.item3.des",
  },
  {
    title: "home.why.item4.title",
    svgKey: "finance",
    description: "home.why.item4.des",
  },
  {
    title: "home.why.item5.title",
    svgKey: "simple",
    description: "home.why.item5.des",
  },
  {
    title: "home.why.item6.title",
    svgKey: "friendly",
    description: "home.why.item6.des",
  },
]

export const ACTIVE_DATA = [
  {
    img: "https://img.alicdn.com/imgextra/i2/O1CN01VKuwfk1VdCRmeL0Do_!!6000000002675-0-tps-940-400.jpg",
    title: "「大师课」深度剖析 RocketMQ5.0",
    href: "https://edu.aliyun.com/course/317148",
    target: "_blank"
  },
  {
    img: "https://img.alicdn.com/imgextra/i3/O1CN017Ek4cV1kG2eq1HRgK_!!6000000004655-0-tps-1080-384.jpg",
    title: "RocketMQ Summit 2022",
    href: "/community/summit/",
    target: "_self"
  },
  {
    img: "https://img.alicdn.com/imgextra/i3/O1CN01ngMIsg1vDiPz74Ulz_!!6000000006139-0-tps-720-427.jpg",
    title: "RocketMQ x EventMesh Open Day 2021",
    href: "/community/meetup/",
    target: "_self"
  },
];

export const LEARNING_DATA = [
  {
    title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案 ",
    href: "",
  },
  {
    title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案 ",
    href: "",
  },
  {
    title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案 ",
    href: "",
  },
]

export const RECOMMEND_DATA = [
  {
    title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案 ",
    href: "",
  },
  {
    title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案 ",
    href: "",
  },
  {
    title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案 ",
    href: "",
  },
]

// 文章主tag
export const ARTICLE_TAG = [
  {
    type: 'all',
    title: '全部文章',
    href: '/learning/'
  },
  // {
  //   type: 'ai',
  //   title: 'AI 原生应用',
  //   href: '/learning/ai/'
  // },
  {
    type: 'practice',
    title: '行业实践',
    href: '/learning/practice/'
  },

  {
    type: 'explore',
    title: '技术探索',
    href: '/learning/explore/'
  },
  {
    type: 'dynamic',
    title: '社区动态',
    href: '/learning/dynamic/'
  },
];

// 文章所有tag
export const ALL_ARTICLE_TAG = [
  {
    type: 'practice',
    title: "行业实践",
    href: '/learning/practice/'
  },
  {
    type: 'explore',
    title: '技术探索',
    href: '/learning/explore/'
  },
  {
    type: 'dynamic',
    title: '社区动态',
    href: '/learning/dynamic/'
  },
  // {
  //   type: 'ai',
  //   title: "AI 原生应用",
  //   href: '/learning/ai/'
  // },
  {
    type: 'bestPractice',
    title: "最佳实践",
    href: '/learning/bestPractice/'
  },
];

// 社区页tag
export const COMMUNITY_TAG = [
  {
    type: 'meetup',
    title: "#Meetup",
    href: '/community/meetup/'
  },
  {
    type: 'summit',
    title: '#Summit',
    href: '/community/summit/'
  },
  {
    type: 'live',
    title: '#直播教程',
    href: '/community/live/'
  },
];

export const COMMUNITY_BANNER_DATA =   {
  tag: 'meetup',
  id: 'm1',
  time: "2021年8月",
  title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
  introduction: [
    {
      author: "金融通",
      position:
        "Apache RocketMQ PMC Member & Committer，阿里云智能高级开发工程师",
    },
  ],
  des: "RocketMQ x EventMesh Open Day 线上直播（一）",
  href: "/community/detail/m1/",
  source: "https://cloud.video.taobao.com/play/u/null/p/1/e/6/t/1/d/ud/355043993582.mp4",
  img: "https://img.alicdn.com/imgextra/i2/O1CN01JJOlDv1wWJu9rzqkZ_!!6000000006315-2-tps-1291-563.png"
};

// 社区页数据
export const COMMUNITY_DATA = [
  {
    tag: 'meetup',
    id: 'm1',
    time: "2021年8月",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    introduction: [
      {
        author: "金融通",
        position:
          "Apache RocketMQ PMC Member & Committer，阿里云智能高级开发工程师",
      },
    ],
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m1/",
    source: "https://cloud.video.taobao.com/play/u/null/p/1/e/6/t/1/d/ud/355043993582.mp4",
    img: "https://img.alicdn.com/imgextra/i2/O1CN01JJOlDv1wWJu9rzqkZ_!!6000000006315-2-tps-1291-563.png"
  },
  {
    tag: 'meetup',
    id: 'm2',
    time: "2021年8月",
    title: "基于 OpenSchema 的 SchemaRegistry 实现",
    introduction: [
      {
        author: "梁炜强",
        position: "微众银行中间件研发工程师",
      },
    ],
    des: "RocketMQ x EventMesh Open Day 线上直播（三）",
    href: "/community/detail/m2/",
    source: "https://cloud.video.taobao.com/play/u/null/p/1/e/6/t/1/d/ud/354501760073.mp4",
    img: "https://img.alicdn.com/imgextra/i2/O1CN01wxOXFd1sHQZ2obeyy_!!6000000005741-2-tps-1291-563.png"
  },
  {
    tag: 'meetup',
    id: 'm3',
    time: "2021年8月",
    title: "基于 RocketMQ 构建阿里云事件驱动引擎——EventBridge",
    introduction: [
      {
        author: "韩陆",
        position: "阿里云事件总线产品研发",
      },
    ],
    des: "RocketMQ x EventMesh Open Day 线上直播（四）",
    href: "/community/detail/m3/",
    source: "https://cloud.video.taobao.com/play/u/null/p/1/e/6/t/1/d/ud/354501688435.mp4",
    img: "https://img.alicdn.com/imgextra/i4/O1CN01G2GPlC1jnBTy9nhho_!!6000000004592-2-tps-1291-563.png"
  },
  {
    tag: 'meetup',
    id: 'm4',
    time: "2021年8月",
    title: "基于 RocketMQ 的基金数字化陪伴体系的架构实践",
    introduction: [
      {
        author: "伍振河",
        position: "博时基金互联网开放平台负责人",
      },
      {
        author: "陈培新",
        position:
          "就职于国信证券信息技术总部，目前负责国信技术中台的建设工作，目前专注于微服务架构、Serverless 技术",
      },
    ],    
    des: "RocketMQ x EventMesh Open Day 线上直播（五）",
    href: "/community/detail/m4/",
    source: "https://cloud.video.taobao.com/play/u/null/p/1/e/6/t/1/d/ud/355042453895.mp4",
    img: "https://img.alicdn.com/imgextra/i2/O1CN018a86IZ1WVExZcwugo_!!6000000002793-2-tps-1291-563.png"
  },
  {
    tag: 'meetup',
    id: 'm5',
    time: "2021年11月16日",
    title: "RocketMQ with Hudi & Kyuubi线上沙龙",
    introduction: [
      {
        author: "李致波",
        position: "Apache RocketMQ  Committer",
      },
      {
        author: "姚琴（Kent Yao）",
        position:
          "Apache Submarine  Committer、Apache Spark  Committer、Apache Kyuubi （Incubating）发起人及PPMC、网易数帆-有数",
      },
      {
        author: "王平",
        position: "阿里云智能技术专家",
      },
      {
        author: "李远照",
        position: "平安证券大数据平台开发工程师",
      },
      {
        author: "曹融",
        position: "就职于喜马拉雅，目前负责公司服务治理和消息治理相关工作",
      },
    ],
    des: "RocketMQ with Hudi & Kyuubi线上沙龙",
    href: "/community/detail/m5/",
    source: "https://vod-yq-aliyun.taobao.com/vod-7651a3/62f50eeed66a46a0aa23383bb44f1000/b18cbaeabde5fe2744f3935518221c3c-hd.mp4",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01NhGsJG1UjJzQjYPth_!!6000000002553-0-tps-1291-563.jpg"
  },
  {
    tag: 'meetup',
    id: "m6",
    title: "RocketMQ X OceanBase 线上技术沙龙",
    time: "2023年2月16日",
    des: "RocketMQ X OceanBase 线上技术沙龙",
    href: "/community/detail/m6/",
    img: "https://img.alicdn.com/imgextra/i1/O1CN01EhGwkT1J0126wPGkn_!!6000000000965-0-tps-1291-563.jpg",
    source: "https://cloud.video.taobao.com/play/u/null/p/1/e/6/t/1/406062368920.mp4?SBizCode=xiaoer",
    introduction: [
      {
        author: "沙仟罚",
        position: "某游戏公司大数据负责人",
      },
      {
        author: "周波",
        position: "Apache RocketMQ  Committer",
      },
      {
        author: "蔡飞志",
        position: "OceanBase技术专家",
      },
    ],
  },
  {
    tag: 'summit',
    id: 's1',
    time: "2022年7月21日",
    title: "RocketMQ Summit 2022 - 主论坛",
    introduction: [
      {
        author: "丁宇",
        position: "阿里巴巴研究员，阿里云智能云原生应用平台负责人",
      },
      {
        author: "王小瑞",
        position:
          "Apache RocketMQ作者、创始人、PMC Chair，阿里云智能资深技术专家，电商业务云原生架构升级负责人",
      },
      {
        author: "林清山",
        position: "阿里云智能资深技术专家，阿里云消息平台负责人",
      },
      {
        author: "邓志文",
        position: "小米研发工程师",
      },
      {
        author: "黄理",
        position: "快手在线消息系统负责人",
      },
    ],
    des: "RocketMQ Summit 2022 - 主论坛",
    href: "/community/detail/s1/",
    source: "https://vod-yq-aliyun.taobao.com/vod-7651a3/4001d9dc9f754232a13d8d30d326272a/15fb013425d14cf0aeb0a4767333b138-hd.mp4",
    img: "https://img.alicdn.com/imgextra/i4/O1CN01UP6cbA1aAPUhVkKFh_!!6000000003289-0-tps-1920-1080.jpg"
  },
  {
    tag: 'summit',
    id: 's2',
    time: "2022年7月21日",
    title: "RocketMQ Summit 2022 - 开源生态发展 DAY1",
    introduction: [
      {
        author: "杜恒",
        position:
          "Apache Member，Apache RocketMQ PMC member, 阿里云 RocketMQ 混合云及开源研发负责人",
      },
      {
        author: "李建",
        position: "达摩院技术专家",
      },
      {
        author: "郭雨杰",
        position: "阿里云智能技术专家",
      },
      {
        author: "王院生",
        position: "Apache APISIX PMC",
      },
      {
        author: "史明伟",
        position: "阿里云智能高级技术专家",
      },
      {
        author: "薛炜明",
        position: "微众银行中间件研发工程师",
      },
      {
        author: "张杰",
        position: "OpenYurt 社区核心维护者，阿里云智能技术专家",
      },
    ],
    des: "RocketMQ Summit 2022 - 开源生态发展 DAY1",
    href: "/community/detail/s2/",
    source: "https://vod-yq-aliyun.taobao.com/vod-7651a3/20d86e5aee2f4f7d8e6087609fe2cd3d/30516fba5270cb84cf401d01c74cc1d0-hd.mp4",
    img: "https://img.alicdn.com/imgextra/i1/O1CN01x19XWS1VhmGgUwy2S_!!6000000002685-0-tps-1920-1080.jpg"
  },
  {
    tag: 'summit',
    id: 's3',
    time: "2022年7月21日",
    title: "RocketMQ Summit 2022 - 行业探索实践 DAY1",
    introduction: [
      {
        author: "周新宇",
        position:
          "Apache Member，Apache RocketMQ PMC Member，阿里云消息队列RocketMQ研发负责人",
      },
      {
        author: "高向阳",
        position: "转转资深研发工程师",
      },
      {
        author: "房成进",
        position: "小米高级研发工程师",
      },
      {
        author: "区二立",
        position: "vivo 技术架构总监",
      },
      {
        author: "尹启绣",
        position: "阿里云智能钉钉技术专家",
      },
      {
        author: "李伟",
        position:
          "Apache RocketMQ Committer，RocketMQ Python客户端项目Owner ，Apache Doris Contributor，腾讯云数据库开发工程师",
      },
      {
        author: "魏欢",
        position: "谐云资深技术总监，中国信通院可信云标准专家",
      },
    ],
    des: "RocketMQ Summit 2022 - 行业探索实践 DAY1",
    href: "/community/detail/s3/",
    source: "https://vod-yq-aliyun.taobao.com/vod-7651a3/458f7393618c484a972494507912c326/e3f0e46c41447bf478f395d6b43ac6f5-hd.mp4",
    img: "https://img.alicdn.com/imgextra/i2/O1CN01DwuV3x1aJ716oeDS7_!!6000000003308-0-tps-1920-1080.jpg"
  },
  {
    tag: 'summit',
    id: 's4',
    time: "2022年7月21日",
    title: "RocketMQ Summit 2022 - 核心技术解析",
    introduction: [
      {
        author: "刘振东",
        position: "Apache RocketMQ PMC Member，阿里云智能消息队列Kafka负责人",
      },
      {
        author: "袁小栋",
        position:
          "Apache RocketMQ Committer，RocketMQ-streams Co-Founder，阿里云智能高级技术专家，安全智能计算引擎负责人",
      },
      {
        author: "沈林",
        position: "阿里云智能技术专家",
      },
      {
        author: "金吉祥",
        position: "Apache RocketMQ PMC Member，阿里云智能高级技术专家",
      },
      {
        author: "金融通",
        position:
          "Apache RocketMQ PMC Member & Committer，阿里云智能高级开发工程师",
      },
      {
        author: "艾阳坤",
        position:
          "Apache RocketMQ 5.0 Java SDK 作者，CNCF Envoy Contributor，CNCF OpenTelemetry Contributor，阿里云智能高级开发工程师",
      },
      {
        author: "王平",
        position: "阿里云智能技术专家",
      },
    ],
    des: "RocketMQ Summit 2022 - 核心技术解析",
    href: "/community/detail/s4/",
    source: "https://vod-yq-aliyun.taobao.com/vod-7651a3/ace87dcddc044576acbe6bcb4ce82fd4/729d03df09379102dcf44e2ac7642ec0-hd.mp4",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01mFg49v1MkgEgY8G4j_!!6000000001473-0-tps-1920-1080.jpg"
  },
  {
    tag: 'summit',
    id: 's5',
    time: "2022年7月22日",
    title: "RocketMQ Summit 2022 - 开源生态发展 DAY2",
    introduction: [
      {
        author: "梁炜强",
        position: "微众银行中间件研发工程师",
      },
      {
        author: "李致波",
        position: "阿里云智能技术专家，RocketMQ Committer",
      },
      {
        author: "胡泰室",
        position: "快手Java开发工程师",
      },
      {
        author: "饶子昊",
        position: "Spring Cloud Alibaba Committer，阿里云智能开发工程师",
      },
      {
        author: "郝洪范",
        position: "Dubbogo Committer，京东资深研发工程师",
      },
      {
        author: "肖京",
        position: "阿里云智能技术专家",
      },
    ],
    des: "RocketMQ Summit 2022 - 开源生态发展 DAY2",
    href: "/community/detail/s5/",
    source: "https://vod-yq-aliyun.taobao.com/vod-7651a3/cdcd9c9ce45b44c4998b6c356b4c63e5/a7670d86c206609a62aa262bcde4746b-hd.mp4",
    img: "https://img.alicdn.com/imgextra/i1/O1CN01x19XWS1VhmGgUwy2S_!!6000000002685-0-tps-1920-1080.jpg"
  },
    {
    tag: 'summit',
    id: 's6',
    time: "2022年7月22日",
    title: "RocketMQ Summit 2022 - 行业探索实践 DAY2",
    introduction: [
      {
        author: "金凤华",
        position: "光大银行信息科技部中间件领域技术专家",
      },
      {
        author: "胡宗棠",
        position:
          "中国移动云能力中心云原生消息&RPC领域技术专家，Apache RocketMQ & SOFAJRaft & Nacos Committer",
      },
      {
        author: "刘树东",
        position: "同程艺龙技术专家",
      },
      {
        author: "丁威",
        position:
          "中通快递资深架构师，《RocketMQ技术内幕》作者，Apache RocketMQ社区首席布道师，公众号「中间件兴趣圈」维护者",
      },
      {
        author: "申栋",
        position: "中国移动云能力中心软件开发工程师",
      },
    ],
    des: "RocketMQ Summit 2022 - 行业探索实践 DAY2",
    href: "/community/detail/s6/",
    source: "https://vod-yq-aliyun.taobao.com/vod-7651a3/944e9f9319d9496ea41090ae3fc8c3f7/9c1c8f4a45f27e67aceef52081e98ddd-hd.mp4",
    img: "https://img.alicdn.com/imgextra/i2/O1CN01DwuV3x1aJ716oeDS7_!!6000000003308-0-tps-1920-1080.jpg"
  },
  {
    tag: 'live',
    id: 'l1',
    time: "",
    title: "「大师课」深度剖析 RocketMQ5.0",
    des: "「大师课」深度剖析 RocketMQ5.0",
    href: "https://edu.aliyun.com/course/317148",
    target: "_blank",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'live',
    id: 'l2',
    time: "",
    title: "消息队列RocketMQ 5.0 云原生架构升级课程",
    des: "消息队列RocketMQ 5.0 云原生架构升级课程",
    href: "https://edu.aliyun.com/course/317045",
    target: "_blank",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'live',
    id: 'l3',
    time: "",
    title: "消息队列 RocketMQ 消息集成",
    des: "消息队列 RocketMQ 消息集成",
    href: "https://edu.aliyun.com/course/316794",
    target: "_blank",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'live',
    id: 'l4',
    time: "",
    title: "RocketMQ知识精讲与项目实战（第一阶段）",
    des: "RocketMQ知识精讲与项目实战（第一阶段）",
    href: "https://edu.aliyun.com/course/314845",
    target: "_blank",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'live',
    id: 'l5',
    time: "",
    title: "RocketMQ知识精讲与项目实战（第二阶段）",
    des: "RocketMQ知识精讲与项目实战（第二阶段）",
    href: "https://edu.aliyun.com/course/314846",
    target: "_blank",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'live',
    id: 'l6',
    time: "",
    title: "RocketMQ知识精讲与项目实战（第三阶段）",
    des: "RocketMQ知识精讲与项目实战（第三阶段）",
    target: "_blank",
    href: "https://edu.aliyun.com/course/314849",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
];

// 事件驱动架构平台
export const EVENTS_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01FeFvWd25Jnq6P0C1W_!!6000000007506-2-tps-50-52.png',
    product: "RabbitMQ",
    hoverContent: {
      des: "⼀个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。",
      clound:"https://www.aliyun.com/product/amqp"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01N0N9xh1OJJwadnOvE_!!6000000001684-2-tps-61-45.png',
    product: "Kafka",
    hoverContent: {
      des: "广泛用于日志收集、监控数据聚合、流式数据处理、在线和离线分析等场景的分布式消息队列。",
      clound:"https://www.aliyun.com/product/kafka"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01ZwXAxy1XvdcbUt1QQ_!!6000000002986-2-tps-51-51.png',
    product: "EventBridge",
    hoverContent: {
      des: "EventBridge 致力于帮助用户构建高可靠、低耦合、高性能的事件驱动架构。",
      github: "https://github.com/apache/rocketmq-eventbridge",
      api: "https://api.github.com/repos/apache/rocketmq-eventbridge",
      openSource: "https://rocketmq.apache.org/",
      clound:"https://www.aliyun.com/product/aliware/eventbridge"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN013Zi9bB26Qxdza1JMR_!!6000000007657-2-tps-59-43.png',
    product: "MQTT",
    hoverContent: {
      des: "针对 IoT 类终端设备消息，通过 MQTT、WebSocket 等协议连接端云之间的双向通信。",
      github: "https://github.com/apache/rocketmq-mqtt",
      api: "https://api.github.com/repos/apache/rocketmq-mqtt",
      openSource: "https://rocketmq.apache.org/",
      clound:"https://www.aliyun.com/product/mq4iot"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01M01cAo1V9QhS624fZ_!!6000000002610-2-tps-48-54.png',
    product: "RocketMQ",
    hoverContent: {
      des: "云原生“消息、事件、流”实时数据处理平台，覆盖云边端⼀体化数据处理场景。",
      github: "https://github.com/apache/rocketmq",
      api: "https://api.github.com/repos/apache/rocketmq",
      openSource: "https://rocketmq.apache.org/",
      clound:"https://www.aliyun.com/product/rocketmq"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01W0CvDw1YDV4HNKCQi_!!6000000003025-2-tps-43-43.png',
    product: "MNS",
    hoverContent: {
      des: "MNS 是一款易集成、高并发、可弹性扩展的轻量消息队列服务。",
      clound:"https://www.aliyun.com/product/mns"
    }
  },
];

// 事件
export const EVENT_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01yIEIGc1RszdloGvnx_!!6000000002168-2-tps-64-64.png',
    product: "云服务器",
    hoverContent: {
      des: "IaaS 级别云计算服务，实现计算资源的即开即用和弹性伸缩。",
      clound:"https://www.aliyun.com/product/ecs"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01HK7hqz1OZoCjM3xJd_!!6000000001720-2-tps-55-42.png',
    product: "对象存储",
    hoverContent: {
      des: "以非结构化格式存储和管理数据，如照片、视频、电子邮件、网页、传感器数据和音频文件等。",
      clound:"https://www.aliyun.com/product/oss"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN0162u3gj1QCZL8SGJGq_!!6000000001940-2-tps-59-29.png',
    product: "云监控",
    hoverContent: {
      des: "针对云资源和互联网应用进行监控的服务。",
      clound:"https://www.aliyun.com/product/jiankong"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01MMRakS1FERBLz3lSD_!!6000000000455-2-tps-64-64.png',
    product: "SaaS事件",
  },
];

// 通知
export const NOTICE_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN012W8eEY1BxXivntVWV_!!6000000000012-2-tps-58-58.png',
    product: "语音",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN013OZ12E1F4MSuecWgZ_!!6000000000433-2-tps-52-52.png',
    product: "短信",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01tU1tZE23jKgaZdhtX_!!6000000007291-2-tps-58-47.png',
    product: "邮箱",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN01KMCbjx1opXp1gK6U4_!!6000000005274-2-tps-58-52.png',
    product: "移动推送",
  },
];

// 计算
export const COMPUTE_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01gqnzVX1ibRw74X52F_!!6000000004431-2-tps-51-56.png',
    product: "模型服务",
    hoverContent: {
      des: "通过灵活、易用的模型API服务，让AI开发者使用各种模态模型的能力。",
      clound:"https://www.aliyun.com/product/bailian"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01q9F2NX1IFIm8obpfc_!!6000000000863-2-tps-55-55.png',
    product: "函数计算",
    hoverContent: {
      des: "事件驱动的全托管 Serverless 计算服务，只需编写上传代码，即可以弹性、可靠的方式运行代码。",
      clound:"https://www.aliyun.com/product/fc"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01yASGLy1rt9nCAUiWX_!!6000000005688-2-tps-48-55.png',
    product: "容器",
    hoverContent: {
      des: "基于容器编排引擎 Kubernetes 对容器化应用进行自动化部署、扩缩和全生命周期管理。",
      clound:"https://www.aliyun.com/product/kubernetes"
    }
  },
];

// 存储
export const SAVE_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01HK7hqz1OZoCjM3xJd_!!6000000001720-2-tps-55-42.png',
    product: "对象存储",
    hoverContent: {
      des: "以非结构化格式存储和管理数据，如照片、视频、电子邮件、网页、传感器数据和音频文件等。",
      clound:"https://www.aliyun.com/product/oss"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01L7WLsY1EMORcFCc1p_!!6000000000337-2-tps-51-48.png',
    product: "数据库",
    hoverContent: {
      des: "采用关系模型来组织数据，以行列形式存储数据，支持对结构化数据的复杂查询，同时保持数据的完整性和一致性。",
      clound:"https://www.aliyun.com/product/polardb/mysql"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN012AuE7F1G0zAEHVdZd_!!6000000000561-2-tps-64-51.png',
    product: "NoSQL",
    hoverContent: {
      des: "非关系型数据库，采用不同于关系表的格式存储数据，广泛应用于实时 Web 应用和大数据等。",
      clound:"https://www.aliyun.com/product/redis"
    }
  },
];

// 分析
export const ANALYSIS_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01SrkPML1EWT9tB1UWA_!!6000000000359-2-tps-64-64.png',
    product: "Flink",
    hoverContent: {
      des: "实时分布式的大数据处理引擎，支持数据流和批量数据的统一处理。",
      clound:"https://www.aliyun.com/product/bigdata/sc"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN01uQIjKn1YWjhkUTFuT_!!6000000003067-2-tps-50-54.png',
    product: "Spark",
    hoverContent: {
      des: "大规模数据并行处理引擎，对数据进行协处理、流式处理、交互式分析等。",
      clound:"https://www.aliyun.com/product/emapreduce"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01Pz8LDI1S7Bv4JMyaO_!!6000000002199-2-tps-49-54.png',
    product: "Elastic Search",
    hoverContent: {
      des: "实时分布式的搜索与分析引擎，支持各种类型、规模的数据。",
      clound:"https://www.aliyun.com/product/bigdata/elasticsearch"
    }
  },
];

// 微服务
export const SERVICE_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01UZ7x2A1HVxZ2McbVI_!!6000000000764-2-tps-64-58.png',
    product: "Higress",
    hoverContent: {
      hoverIcon: "https://img.alicdn.com/imgextra/i3/O1CN01RSdSCS20F9kCEoMMm_!!6000000006819-2-tps-173-52.png",
      des: "⼀个遵循开源Ingress/Gateway API标准，提供流量调度、服务治理、安全防护三合⼀的高集成、易使用、易扩展、热更新的下⼀代云原生网关。",
      github: "https://github.com/alibaba/higress",
      api: "https://api.github.com/repos/alibaba/higress",
      openSource: "https://higress.io/",
      clound:""
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN01PSx6bI1ILiJnQ9CWl_!!6000000000877-2-tps-55-64.png',
    product: "Dubbo",
    hoverContent: {
      hoverIcon: "https://img.alicdn.com/imgextra/i2/O1CN016OJGLy215pI2RIAyX_!!6000000006934-2-tps-188-40.png",
      des: "Apache Dubbo是⼀款微服务框架，为⼤规模微服务 实践提供⾼性能RPC通信、流量治理、可观测性等解决⽅案，涵盖Java、Golang等多种语⾔SDK实现。",
      github: "https://github.com/apache/dubbo",
      api: "https://api.github.com/repos/apache/dubbo",
      openSource: "https://dubbo.apache.org/",
      clound:""
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN015rDZHa1ORZ4c5oNeB_!!6000000001702-2-tps-76-76.png',
    product: "Sentinel",
    hoverContent: {
      hoverIcon: "https://img.alicdn.com/imgextra/i2/O1CN01cTYJ8e1tzgfovP4b4_!!6000000005973-2-tps-200-56.png",
      des: "Sentinel是⼀款面向分布式、多语言异构化服务架构的流量治理组件。",
      github: "https://github.com/alibaba/Sentinel",
      api: "https://api.github.com/repos/alibaba/Sentinel",
      openSource: "https://sentinelguard.io/",
      clound:"https://start.aliyun.com/"
    }
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN01z8gLt01zgo2OZHOkP_!!6000000006744-2-tps-105-28.png',
    product: "Seata",
    hoverContent: {
      hoverIcon: "https://img.alicdn.com/imgextra/i3/O1CN01QlPrCC28iwQc6nHHs_!!6000000007967-2-tps-150-40.png",
      des: "Seata是⼀款开源的分布式事务解决方案，致力于在微服务架构下提供高性能和简单易用的分布式事务服务。",
      github: "https://github.com/seata/seata",
      api: "https://api.github.com/repos/seata/seata",
      openSource: "https://seata.io/",
      clound:"https://start.aliyun.com/"
    }
  }, 
  {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01gQxTvL1Jqgiaqt6In_!!6000000001080-2-tps-64-64.png',
    product: "Spring Cloud",
    hoverContent: {
      hoverIcon: "https://img.alicdn.com/imgextra/i4/O1CN01E0cgAx1OkLJbrN85u_!!6000000001743-2-tps-407-40.png",
      des: "一站式的分布式应用开发框架。",
      github: "https://github.com/alibaba/spring-cloud-alibaba",
      api: "https://api.github.com/repos/alibaba/spring-cloud-alibaba",
      openSource: "https://sca.aliyun.com/",
      clound:"https://start.aliyun.com/"
    }
  }, 
  {
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN01Aq4aCt1cvhl6kOT5W_!!6000000003663-2-tps-86-40.png',
    product: "Nacos",
    hoverContent: {
      hoverIcon: "https://img.alicdn.com/imgextra/i2/O1CN010dznG520EEx5lPMy5_!!6000000006817-2-tps-205-40.png",
      des: "⼀个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。",
      github: "https://github.com/alibaba/nacos",
      api: "https://api.github.com/repos/alibaba/nacos",
      openSource: "https://nacos.io/",
      clound:"https://start.aliyun.com/"
    }
  },
];

// 物联网
export const INTERNET_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN01yQex1U1ZHuV57Olbd_!!6000000003170-2-tps-46-57.png',
    product: "家电",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN013zRrBI1nNmC3WkOvZ_!!6000000005078-2-tps-58-52.png',
    product: "汽车",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01b1bax71Sv75hKHETd_!!6000000002308-2-tps-52-52.png',
    product: "穿戴设备",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01ZAZeGI21zhbuB6BQA_!!6000000007056-2-tps-52-58.png',
    product: "充电桩",
  }, {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01pkNcMF1TB8x8xYHjr_!!6000000002343-2-tps-52-52.png',
    product: "工业设备",
  }, {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01ihNXYL1siS9Y17HN7_!!6000000005800-2-tps-39-58.png',
    product: "手机",
  },
];








