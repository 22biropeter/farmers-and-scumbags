import { useEffect } from "react"
import { useResourceStore } from "../store/useResourceStore"
import { useEconomyStore } from "../store/useEconomyStore"
import type { EconomicStats } from "../store/useEconomyStore"
import { useState } from "react"
import "./ResourceBar.css"

const ResourceBar = () => {
  const gold = useResourceStore((state) => state.gold)
  const wood = useResourceStore((state) => state.wood)
  const stone = useResourceStore((state) => state.stone)
  const food = useResourceStore((state) => state.food)
  const population = useResourceStore((state) => state.population)
  const applyEconomicChange = useResourceStore((state) => state.applyEconomicChange)
  const runEconomy = useEconomyStore((state) => state.runEconomy)

  const [economyStats, setEconomyStats] = useState<EconomicStats | null>(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const stats = runEconomy()
      setEconomyStats(stats)
      applyEconomicChange(stats)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [applyEconomicChange, runEconomy])

  return (
    <div className="resourceBar">
      <div className="resourceItem">{gold}🪙<div className = "resourceStat"> {economyStats != null && economyStats.gold > 0 ? "+":""}{economyStats?.gold}</div></div>

      <div className="resourceItem">{wood}🪵<div className = "resourceStat">  {economyStats != null && economyStats.wood > 0 ? "+":""}{economyStats?.wood}</div></div>
      <div className="resourceItem">{stone}🪨<div className = "resourceStat"> {economyStats != null && economyStats.stone > 0 ? "+":""}{economyStats?.stone}</div></div>
      <div className="resourceItem">{food}🥖<div className = "resourceStat"> {economyStats != null && economyStats.food > 0 ? "+":""}{economyStats?.food}</div></div>
      <div className="resourceItem">{population}👥<div className = "resourceStat"> {economyStats != null && economyStats.population > 0 ? "+":""}{economyStats?.population}</div></div>
    </div>
  )
}

export default ResourceBar