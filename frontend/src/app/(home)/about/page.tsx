"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpen,
  Users,
  Heart,
  Award,
  Target,
  Globe,
  Sparkles,
  Quote,
  Calendar,
} from "lucide-react";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero section animation
      gsap.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5,
      });

      gsap.from(".hero-quote", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.8,
      });

      gsap.from(".hero-sparkles", {
        scale: 0,
        rotate: 180,
        duration: 1.5,
        ease: "back.out(1.7)",
        delay: 0.3,
      });

      gsap.from(".hero-image", {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "back.out(1.7)",
        delay: 0.3,
      });

      // Stats section animation
      const counters = document.querySelectorAll(".counter");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target") || "0");

        gsap.to(counter, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            once: true,
          },
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power2.out",
          onUpdate: function () {
            const value = Math.ceil(parseInt(this.targets()[0].innerHTML));
            this.targets()[0].innerHTML = value.toLocaleString();
          },
        });
      });

      // Values section animation with ScrollTrigger
      gsap.from(".value-card", {
        scrollTrigger: {
          trigger: valuesRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
      });

      // Timeline animation
      gsap.from(".timeline-item", {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        x: (index) => (index % 2 === 0 ? -100 : 100),
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power2.out",
      });

      // Contact section animation
      gsap.from(".contact-item", {
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  const coreValues = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Tri thức cho mọi người",
      description:
        "Chúng tôi tin rằng sách là cánh cửa mở ra thế giới tri thức vô tận cho tất cả mọi người.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Cộng đồng yêu sách",
      description:
        "Xây dựng một cộng đồng độc giả gắn kết, chia sẻ và lan tỏa văn hóa đọc.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Đam mê văn học",
      description:
        "Nuôi dưỡng tình yêu với văn chương và nghệ thuật qua từng trang sách.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Chất lượng hàng đầu",
      description:
        "Cam kết mang đến những cuốn sách chất lượng với nội dung giá trị.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Định hướng phát triển",
      description:
        "Không ngừng đổi mới để phù hợp với nhu cầu đọc sách trong thời đại số.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Kết nối văn hóa",
      description:
        "Giới thiệu và kết nối những tác phẩm văn học từ nhiều nền văn hóa khác nhau.",
    },
  ];

  const teamMembers = [
    {
      name: "Mộ xum xuê",
      role: "Founder & CEO",
      bio: "Với 15 năm kinh nghiệm trong ngành xuất bản, luôn đam mê lan tỏa văn hóa đọc.",
      image: "/images/team/ceo.jpg",
    },
    {
      name: "Nộm kim chi",
      role: "Quản lý cửa hàng",
      bio: "Chuyên gia tư vấn sách với khả năng kết nối độc giả với những tác phẩm phù hợp.",
      image: "/images/team/manager.jpg",
    },
    {
      name: "Độ ngô cao bằng chó",
      role: "Chuyên gia văn học",
      bio: "Nhà phê bình văn học với nhiều năm nghiên cứu và giảng dạy về văn chương.",
      image: "/images/team/expert.jpg",
    },

    {
      name: "Độ tày",
      role: "Chuyên gia văn học",
      bio: "Nhà phê bình văn học với nhiều năm nghiên cứu và giảng dạy về văn chương.",
      image: "/images/team/expert.jpg",
    },
  ];

  const timelineData = [
    {
      year: "2015",
      title: "Khởi nghiệp",
      description:
        "REBO được thành lập với một không gian nhỏ tại trung tâm thành phố.",
    },
    {
      year: "2018",
      title: "Mở rộng",
      description:
        "Mở thêm 2 chi nhánh và phát triển hệ thống đặt hàng trực tuyến.",
    },
    {
      year: "2020",
      title: "Chuyển đổi số",
      description:
        "Ứng dụng công nghệ vào quản lý và trải nghiệm mua sắm của khách hàng.",
    },
    {
      year: "2023",
      title: "Cộng đồng",
      description:
        "Xây dựng cộng đồng 10.000+ độc giả thường xuyên tham gia các sự kiện.",
    },
  ];

  const stats = [
    { number: 50000, label: "Đầu sách", suffix: "+" },
    { number: 10000, label: "Thành viên", suffix: "+" },
    { number: 5, label: "Chi nhánh", suffix: "" },
    { number: 8, label: "Năm kinh nghiệm", suffix: "" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden py-20 md:py-28"
      >
        <div className="absolute inset-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative">
                <Sparkles className="hero-sparkles w-12 h-12 text-teal-500 mb-6" />
                <h1 className="hero-title text-5xl md:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-teal-600 to-green-700 bg-clip-text text-transparent">
                    Câu chuyện REBO
                  </span>
                </h1>
                <p className="hero-subtitle text-xl text-gray-600 mb-8 leading-relaxed">
                  Từ một không gian nhỏ bé đến một cộng đồng yêu sách rộng lớn,
                  chúng tôi không ngừng lan tỏa tình yêu với tri thức và văn
                  chương.
                </p>
                <blockquote className="hero-quote border-l-4 border-teal-500 pl-6 py-3 italic text-gray-700">
                  <Quote className="inline-block w-5 h-5 mr-2 text-teal-500" />
                  "Mỗi cuốn sách là một cuộc phiêu lưu, mỗi trang giấy là một
                  chân trời mới."
                </blockquote>
              </div>
            </div>
            <div className="hero-image relative">
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/50 to-transparent" />
                <div className="w-full h-full bg-gradient-to-br from-teal-400 to-green-600 flex items-center justify-center">
                  <BookOpen className="w-32 h-32 text-white opacity-80" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-500 rounded-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-500 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">
                  <span className="counter" data-target={stat.number}>
                    0
                  </span>
                  {stat.suffix}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Giá trị cốt lõi</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Những nguyên tắc định hướng cho mọi hoạt động của REBO
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="value-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-transform border border-gray-100 hover:-translate-y-1  duration-300"
              >
                <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={timelineRef} className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Hành trình phát triển</h2>
            <p className="text-gray-600 text-lg">
              Những cột mốc đáng nhớ trên chặng đường của REBO
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-8 md:left-1/2 h-full w-1 bg-teal-200 transform md:-translate-x-1/2" />
            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`timeline-item relative mb-12 ${
                  index % 2 === 0
                    ? "md:pr-1/2 md:pl-0 md:text-right pr-16"
                    : "md:pl-1/2 md:pr-0 pl-16"
                }`}
              >
                <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-100">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {item.year}
                    </div>
                    <div>
                      <Calendar className="w-5 h-5 text-teal-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <div className="absolute top-6 left-0 w-4 h-4 bg-teal-500 rounded-full border-4 border-white transform -translate-x-1/2 md:left-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <div className="py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Đội ngũ REBO</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Những người đam mê sách và tận tâm với sứ mệnh lan tỏa văn hóa đọc
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="team-member group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Member info with image and text side by side */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Image container */}
                <div className="relative w-full md:w-1/3">
                  <div className="relative h-48 md:h-40 w-full overflow-hidden rounded-xl">
                    {member.image ? (
                      <>
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center">
                        <Users className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Role badge */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-500 to-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg min-w-[120px] text-center">
                    {member.role}
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-teal-700 transition-colors">
                    {member.name}
                  </h3>
                  <div className="h-1 w-8 bg-gradient-to-r from-teal-400 to-green-500 mb-4 rounded-full" />
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>

                  {/* Additional info */}
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="w-2 h-2 bg-teal-400 rounded-full mr-2"></span>
                      <span>15+ năm kinh nghiệm</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      <span>Chuyên môn: Xuất bản & Phê bình</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
