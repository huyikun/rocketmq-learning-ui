import Button from './Button.jsx';
import Star from "./Star.jsx";
import Fork from "./Fork.jsx";
import sendFetch from "@/utils/sendFetch"
import { useEffect, useState } from "preact/hooks";

const StarAndForkV2 = (props) => {
  const { SITE } = props;
  const [startCount, setStartCount] = useState(0);
  const [forkCount, setForkCount] = useState(0);

  const start = async () => {
    const relativePath = SITE.githubUrl.split("https://github.com/")[1];
    const data = await sendFetch(`https://api.github.com/repos/${relativePath}`);
    const { stargazers_count = 20880, forks_count = 11551 } = data;
    setStartCount(stargazers_count);
    setForkCount(forks_count);
  };

  useEffect(() => {
    start();
  }, []);

  return (
    <star-and-fork class="shortcut flex">
      <Button
        size="large"
        class="rounded-3xl border-none"
        href={SITE.githubUrl}
        target="_blank"
        theme="primary"
        iconClass="text-fork"
      >
        <Star class="text-fork" />
        <span class="text-[0.875rem] leading-4 ml-2 text-fork">{startCount || 20880}</span>
      </Button>

      <Button
        size="large"
        class="ml-4 rounded-3xl border-none"
        href={`${SITE.githubUrl}/fork`}
        target="_blank"
        theme="card"
        iconClass="text-fork"
      >
        <Fork theme="light" class="text-fork" />
        <span class="ml-2 text-fork">{forkCount || 11551}</span>
      </Button>
    </star-and-fork>
  );
};

export default StarAndForkV2;