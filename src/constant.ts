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
export const HOTTUTORIALDATA = [
  {
    cover: "https://img.alicdn.com/imgextra/i2/O1CN01psWBwW1tzgeAxapCz_!!6000000005973-0-tps-2448-3672.jpg",
    coverPosition: "bottom",
    title: "Apache RocketMQ从入门到实践1",
    enTitle: "Apache RocketMQ从入门到实践",
    body: "home.introduction.card.Nacos.des",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
  {
    cover: "https://img.alicdn.com/imgextra/i2/O1CN01psWBwW1tzgeAxapCz_!!6000000005973-0-tps-2448-3672.jpg",
    coverPosition: "bottom",
    title: "Apache RocketMQ从入门到实践2",
    enTitle: "Apache RocketMQ从入门到实践",
    body: "home.introduction.card.Nacos.des",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
  {
    cover: "https://img.alicdn.com/imgextra/i2/O1CN01psWBwW1tzgeAxapCz_!!6000000005973-0-tps-2448-3672.jpg",
    coverPosition: "bottom",
    title: "Apache RocketMQ从入门到实践3",
    enTitle: "Apache RocketMQ从入门到实践",
    body: "home.introduction.card.Nacos.des",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
  {
    cover: "https://img.alicdn.com/imgextra/i2/O1CN01psWBwW1tzgeAxapCz_!!6000000005973-0-tps-2448-3672.jpg",
    coverPosition: "bottom",
    title: "Apache RocketMQ从入门到实践4",
    enTitle: "Apache RocketMQ从入门到实践",
    body: "home.introduction.card.Nacos.des",
    href: "docs/2023/user-guide/nacos/quick-start/",
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

//最新公告
export const NEW_ANN_CONTENT = [
  {
    date: '2023-12-22',
    title: 'RocketMQ 多语言 SDK 开源贡献召集令',
    content: '社区纪念品和成为 committer 的机会等着你！',
    href: ''
  },
  {
    date: '2024-02-22',
    title: 'RocketMQ 多语言 SDK 开源贡献召集令',
    content: '社区纪念品和成为 committer 的机会等着你！',
    href: ''
  },
  {
    date: '2024-06-22',
    title: 'RocketMQ 多语言 SDK 开源贡献召集令',
    content: '社区纪念品和成为 committer 的机会等着你！',
    href: ''
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
    time: "2023.7.28  12:00-16:30",
    img: "https://img.alicdn.com/imgextra/i2/O1CN01psWBwW1tzgeAxapCz_!!6000000005973-0-tps-2448-3672.jpg",
    title: "RocketMQ Summit - 行业探索实践",
    enTitle: "RocketMQ Summit - 行业探索实践",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
  {
    time: "2023.7.29  12:00-16:30",
    img: "https://img.alicdn.com/imgextra/i2/O1CN01psWBwW1tzgeAxapCz_!!6000000005973-0-tps-2448-3672.jpg",
    title: "RocketMQ Summit - 行业探索实践",
    enTitle: "RocketMQ Summit - 行业探索实践",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
  {
    time: "2023.7.30  12:00-16:30",
    img: "https://img.alicdn.com/imgextra/i2/O1CN01psWBwW1tzgeAxapCz_!!6000000005973-0-tps-2448-3672.jpg",
    title: "RocketMQ Summit - 行业探索实践",
    enTitle: "RocketMQ Summit - 行业探索实践",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
  {
    time: "2023.7.31  12:00-16:30",
    img: "https://img.alicdn.com/imgextra/i2/O1CN01psWBwW1tzgeAxapCz_!!6000000005973-0-tps-2448-3672.jpg",
    title: "RocketMQ Summit - 行业探索实践",
    enTitle: "RocketMQ Summit - 行业探索实践",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
  {
    time: "2023.8.28  12:00-16:30",
    img: "https://img.alicdn.com/imgextra/i2/O1CN01psWBwW1tzgeAxapCz_!!6000000005973-0-tps-2448-3672.jpg",
    title: "RocketMQ Summit - 行业探索实践",
    enTitle: "RocketMQ Summit - 行业探索实践",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },];

export const LEARNING_DATA = [
  {
    title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案 ",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
  {
    title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案 ",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
  {
    title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案 ",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
]

export const RECOMMEND_DATA = [
  {
    title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案 ",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
  {
    title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案 ",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
  {
    title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案 ",
    href: "docs/2023/user-guide/nacos/quick-start/",
  },
]

// 文章主tag
export const ARTICLE_TAG = [
  {
    type: 'all',
    title: '全部文章',
    href: '/learning/'
  },
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
  {
    type: 'ai',
    title: "AI",
    href: '/learning/ai/'
  },
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

export const COMMUNITY_BANNER_DATA = {
  tag: 'meetup',
  id: 'm1',
  time: "2023-12-22",
  title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
  guest: "金融通",
  des: "RocketMQ x EventMesh Open Day 线上直播（一）",
  href: "/community/detail/m1/",
  source: "",
  img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
};

// 社区页数据
export const COMMUNITY_DATA = [
  {
    tag: 'meetup',
    id: 'm1',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    introduction: [
      {
        author: "韩陆",
        position: "阿里云事件总线产品研发",
      },
    ],
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m1/",
    source: "https://cloud.video.taobao.com/play/u/null/p/1/e/6/t/1/d/ud/354501688435.mp4",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'meetup',
    id: 'm2',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m2/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'meetup',
    id: 'm3',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m3/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'meetup',
    id: 'm4',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m4/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'meetup',
    id: 'm5',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m5/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'summit',
    id: 'm6',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m6/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'summit',
    id: 'm7',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m7/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'summit',
    id: 'm8',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m8/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'summit',
    id: 'm9',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m9/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'summit',
    id: 'm10',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m10/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'live',
    id: 'm11',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m11/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'live',
    id: 'm12',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m12/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'live',
    id: 'm13',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m13/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'live',
    id: 'm14',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m14/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
  {
    tag: 'live',
    id: 'm15',
    time: "2023-12-22",
    title: "云原生消息、事件、流超融合平台—— RocketMQ 5.0 初探",
    guest: "金融通",
    des: "RocketMQ x EventMesh Open Day 线上直播（一）",
    href: "/community/detail/m15/",
    source: "",
    img: "https://img.alicdn.com/imgextra/i3/O1CN01SDldKK20lfrQqpGuQ_!!6000000006890-2-tps-596-360.png"
  },
];

// 事件驱动架构平台
export const EVENTS_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01FeFvWd25Jnq6P0C1W_!!6000000007506-2-tps-50-52.png',
    product: "AMQP",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01N0N9xh1OJJwadnOvE_!!6000000001684-2-tps-61-45.png',
    product: "Kafka",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01ZwXAxy1XvdcbUt1QQ_!!6000000002986-2-tps-51-51.png',
    product: "EventBridge",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN013Zi9bB26Qxdza1JMR_!!6000000007657-2-tps-59-43.png',
    product: "MQTT",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01M01cAo1V9QhS624fZ_!!6000000002610-2-tps-48-54.png',
    product: "RocketMQ",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01W0CvDw1YDV4HNKCQi_!!6000000003025-2-tps-43-43.png',
    product: "MNS",
  },
];

// 分析
export const ANALYSIS_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01yIEIGc1RszdloGvnx_!!6000000002168-2-tps-64-64.png',
    product: "ECS",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01yDGka71JitzIEjPSG_!!6000000001063-2-tps-64-64.png',
    product: "OSS",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01ZwXAxy1XvdcbUt1QQ_!!6000000002986-2-tps-51-51.png',
    product: "监控",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01ZwXAxy1XvdcbUt1QQ_!!6000000002986-2-tps-51-51.png',
    product: "SaaS事件",
  },
];

// 通知
export const NOTICE_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01yIEIGc1RszdloGvnx_!!6000000002168-2-tps-64-64.png',
    product: "语音",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01yDGka71JitzIEjPSG_!!6000000001063-2-tps-64-64.png',
    product: "短信",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01ZwXAxy1XvdcbUt1QQ_!!6000000002986-2-tps-51-51.png',
    product: "邮箱",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01ZwXAxy1XvdcbUt1QQ_!!6000000002986-2-tps-51-51.png',
    product: "移动推送",
  },
];

// 通知
export const COMPUTE_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01yIEIGc1RszdloGvnx_!!6000000002168-2-tps-64-64.png',
    product: "模型服务",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01yDGka71JitzIEjPSG_!!6000000001063-2-tps-64-64.png',
    product: "函数计算",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i1/O1CN01ZwXAxy1XvdcbUt1QQ_!!6000000002986-2-tps-51-51.png',
    product: "容器",
  },
];

// 微服务
export const SERVICE_PRODUCTS = [
  {
    icon: 'https://img.alicdn.com/imgextra/i2/O1CN01UZ7x2A1HVxZ2McbVI_!!6000000000764-2-tps-64-58.png',
    product: "Higress",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN01PSx6bI1ILiJnQ9CWl_!!6000000000877-2-tps-55-64.png',
    product: "Dubbo",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN015rDZHa1ORZ4c5oNeB_!!6000000001702-2-tps-76-76.png',
    product: "Sentinel",
  },
  {
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN01z8gLt01zgo2OZHOkP_!!6000000006744-2-tps-105-28.png',
    product: "Seata",
  },  {
    icon: 'https://img.alicdn.com/imgextra/i3/O1CN01gQxTvL1Jqgiaqt6In_!!6000000001080-2-tps-64-64.png',
    product: "Spring Cloud",
  },  {
    icon: 'https://img.alicdn.com/imgextra/i4/O1CN01Aq4aCt1cvhl6kOT5W_!!6000000003663-2-tps-86-40.png',
    product: "Nacos",
  },
];






