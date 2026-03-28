import { LuHeart, LuTarget, LuCode, LuUsersRound, LuUsers, LuCalendar, LuClock } from "react-icons/lu";
import styles from './FeatureCard.module.css'
import { FeatureCardProps } from "@shared/types/cms/CMSTypes";

const icons = {
    heart: LuHeart,
    target: LuTarget,
    code: LuCode,
    users: LuUsersRound,
    people: LuUsers,
    calendar: LuCalendar,
    clock: LuClock,
}

function FeatureCard({icon, color, title, description}: FeatureCardProps){

    const accent = {
        primary: {
            hover: styles.primaryHover,
            iconBg: styles.primaryIconBg,
            iconClr: styles.primaryIconClr,
            circleClr: styles.primaryCircle
        },
        secondary: {
            hover: styles.secondaryHover,
            iconBg: styles.secondaryIconBg,
            iconClr: styles.secondaryIconClr,
            circleClr: styles.secondaryCircle
        },
        accent: {
            hover: styles.accentHover,
            iconBg: styles.accentIconBg,
            iconClr: styles.accentIconClr,
            circleClr: styles.accentCircle
        },
        background: {
            hover: styles.backgroundHover,
            iconBg: styles.backgroundIconBg,
            iconClr: styles.backgroundIconClr,
            circleClr: styles.backgroundCircle
        },
    }
    const c = accent[color]
    const Icon = icons[icon]

    return(
        <div 
            className={`${c.hover} ${styles.card}`}
        >

            <div 
                className={` ${styles.iconBox} ${c.iconBg} ${c.iconClr}`}
            >
                <Icon size={30}/>
            </div>

            <h1 className={styles.title} >
                {title}
            </h1>
                
            <p className={styles.description} >
                {description}
            </p>

        </div>

    )    
}

export const cards: FeatureCardProps[] = [
    {
        icon: "target",
        color: "primary",
        title: "Skill Development",
        description: "Build technical skills through workshops, hackathons, and hands-on projects",
    },
    {
        icon: "code",
        color: "secondary",
        title: "Real Projects",
        description: "Work on meaningful projects that make a difference and build your portfolio.",
    },
    {
        icon: "users",
        color: "primary",
        title: "Community",
        description: "Connect with like-minded students and build lasting professional relationships.",
    },
    {
        icon: "heart",
        color: "secondary",
        title: "Support",
        description: "Get mentorship and guidance from experienced members and industry professionals.",
    }

]

export function FeatureCardRow({ cards: cardList = cards }: { cards?: FeatureCardProps[] }){
    return(
    <div className={styles.CardRow}>
        {cardList.map((card,index) => (
            <FeatureCard
                key={index}
                icon={card.icon}
                color={card.color}
                title={card.title}
                description={card.description}
            />
        ))}
    </div>
    )
}