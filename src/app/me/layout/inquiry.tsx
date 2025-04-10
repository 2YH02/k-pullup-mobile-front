import Section from "@/components/section/section";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";

const Inquiry = ({ close }: { close: VoidFunction }) => {
  return (
    <SwipeClosePage slideType="horizontal" headerTitle="문의" close={close}>
      <Section>
        <div className="p-6 bg-white dark:bg-black-light rounded-lg shadow-full space-y-4">
          <div className="text-2xl font-bold text-center">대한민국 철봉 지도</div>
          <div>
            안녕하세요. 운동을 좋아해 만들게 된 대한민국 철봉 지도입니다.
          </div>
          <div>
            초기 데이터는{" "}
            <a
              href="https://chulbong.kr"
              target="_blank"
              className="font-semibold hover:underline text-primary"
            >
              chulbong.kr
            </a>
            사이트를 이용했으며, 이후에 해당 제작자분께 허락을 받았습니다.
          </div>
          <div>
            더 나은 정보를 제공하기 위해 계속해서 업데이트하고 있으니, 많은
            관심과 이용 부탁드립니다.
          </div>
          <div>
            문의 사항이 있으시면 언제든지
            <a
              href="mailto:chulbong.kr@gmail.com"
              className="text-primary font-semibold hover:underline"
            >
              support@k-pullup.com
            </a>
            에 연락해 주세요.
          </div>

          <div className="text-center">
            <div className="w-full">
              <img src="/hand.gif" alt="운동" className="m-0 h-full mx-auto" />
            </div>
            <div className="text-sm text-grey">제작자 입니다</div>
          </div>
        </div>
      </Section>
    </SwipeClosePage>
  );
};

export default Inquiry;
