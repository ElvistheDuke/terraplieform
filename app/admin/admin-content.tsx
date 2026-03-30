"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { colors } from "@/lib/colors";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Download,
  LogOut,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  age: number;
  sex: "Male" | "Female" | "Other";
  weight: number;
  weightUnit: "kg" | "lbs";
  activityLevel: "Sedentary" | "Light" | "Moderate" | "Very Active";
  fitnessGoal: "Lose Weight" | "Maintain Weight" | "Gain Muscle";
  allergies: string[];
  healthConditions: string[];
  spiceLevel: number;
  frequentMeal: string;
  bestFood: string;
  worstFood: string;
  createdAt: string;
}

type SortableKey = keyof Omit<User, "_id" | "allergies" | "healthConditions">;

const ITEMS_PER_PAGE = 10;

function exportCSV(users: User[]) {
  const headers = [
    "Name", "Email", "Phone", "Address", "Age", "Sex",
    "Weight", "WeightUnit", "ActivityLevel", "FitnessGoal",
    "Allergies", "HealthConditions", "SpiceLevel",
    "FrequentMeal", "BestFood", "WorstFood", "JoinedAt",
  ];
  const rows = users.map((u) => [
    u.name,
    u.email ?? "",
    u.phone ?? "",
    u.address ?? "",
    u.age,
    u.sex,
    u.weight,
    u.weightUnit,
    u.activityLevel,
    u.fitnessGoal,
    u.allergies.join(";"),
    u.healthConditions.join(";"),
    u.spiceLevel,
    u.frequentMeal,
    u.bestFood,
    u.worstFood,
    new Date(u.createdAt).toISOString(),
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `terraplie-users-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboardContent() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSex, setFilterSex] = useState("All");
  const [filterActivity, setFilterActivity] = useState("All");
  const [filterGoal, setFilterGoal] = useState("All");
  const [sortKey, setSortKey] = useState<SortableKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((e) => console.error("Error fetching users:", e))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key: SortableKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let result = users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q);
      const matchesSex = filterSex === "All" || u.sex === filterSex;
      const matchesActivity =
        filterActivity === "All" || u.activityLevel === filterActivity;
      const matchesGoal = filterGoal === "All" || u.fitnessGoal === filterGoal;
      return matchesSearch && matchesSex && matchesActivity && matchesGoal;
    });

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey] ?? "";
        const bVal = b[sortKey] ?? "";
        let cmp: number;
        if (typeof aVal === "number" && typeof bVal === "number") {
          cmp = aVal - bVal;
        } else {
          cmp = String(aVal).localeCompare(String(bVal));
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [users, searchQuery, filterSex, filterActivity, filterGoal, sortKey, sortDir]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const avgWeight =
    users.length > 0
      ? (users.reduce((s, u) => s + u.weight, 0) / users.length).toFixed(1)
      : "0";
  const avgAge =
    users.length > 0
      ? (users.reduce((s, u) => s + u.age, 0) / users.length).toFixed(0)
      : "0";
  const goalCounts = {
    lose: users.filter((u) => u.fitnessGoal === "Lose Weight").length,
    maintain: users.filter((u) => u.fitnessGoal === "Maintain Weight").length,
    gain: users.filter((u) => u.fitnessGoal === "Gain Muscle").length,
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const SortIcon = ({ col }: { col: SortableKey }) => {
    if (sortKey !== col) return <ChevronsUpDown size={14} className="inline ml-1 opacity-40" />;
    return sortDir === "asc"
      ? <ChevronUp size={14} className="inline ml-1" />
      : <ChevronDown size={14} className="inline ml-1" />;
  };

  const SortableHead = ({ col, label }: { col: SortableKey; label: string }) => (
    <TableHead>
      <button
        onClick={() => handleSort(col)}
        className="flex items-center gap-0.5 hover:text-gray-900 transition-colors whitespace-nowrap"
      >
        {label}
        <SortIcon col={col} />
      </button>
    </TableHead>
  );

  const selectClass =
    "border border-gray-200 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-sage";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full animate-spin mx-auto"
            style={{
              borderColor: colors.border,
              borderTopColor: colors.sage,
              borderWidth: "4px",
            }}
          />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.lightBg }} className="min-h-screen py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-1" style={{ color: colors.slate }}>
              Terraplie Admin
            </h1>
            <p className="text-gray-500 text-sm">
              {users.length} user{users.length !== 1 ? "s" : ""} onboarded
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: users.length, delay: 0 },
            { label: "Avg Age", value: avgAge, delay: 0.1 },
            { label: "Avg Weight", value: `${avgWeight} kg`, delay: 0.2 },
          ].map(({ label, value, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay }}
            >
              <Card style={{ backgroundColor: colors.cream }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold" style={{ color: colors.sage }}>
                    {value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card style={{ backgroundColor: colors.cream }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Fitness Goals</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lose Weight</span>
                  <span className="font-semibold" style={{ color: colors.sage }}>{goalCounts.lose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintain</span>
                  <span className="font-semibold" style={{ color: colors.sage }}>{goalCounts.maintain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gain Muscle</span>
                  <span className="font-semibold" style={{ color: colors.sage }}>{goalCounts.gain}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Table Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card style={{ backgroundColor: colors.cream }}>
            <CardHeader>
              {/* Search + Export */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search by name, email or phone..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportCSV(filteredUsers)}
                  className="flex items-center gap-2 shrink-0"
                >
                  <Download size={16} />
                  Export CSV
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mt-3">
                <select
                  value={filterSex}
                  onChange={(e) => { setFilterSex(e.target.value); setCurrentPage(1); }}
                  className={selectClass}
                >
                  <option value="All">All Sexes</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <select
                  value={filterActivity}
                  onChange={(e) => { setFilterActivity(e.target.value); setCurrentPage(1); }}
                  className={selectClass}
                >
                  <option value="All">All Activity Levels</option>
                  <option value="Sedentary">Sedentary</option>
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Very Active">Very Active</option>
                </select>

                <select
                  value={filterGoal}
                  onChange={(e) => { setFilterGoal(e.target.value); setCurrentPage(1); }}
                  className={selectClass}
                >
                  <option value="All">All Goals</option>
                  <option value="Lose Weight">Lose Weight</option>
                  <option value="Maintain Weight">Maintain Weight</option>
                  <option value="Gain Muscle">Gain Muscle</option>
                </select>

                {(filterSex !== "All" || filterActivity !== "All" || filterGoal !== "All" || searchQuery) && (
                  <span className="text-sm text-gray-500 self-center">
                    {filteredUsers.length} of {users.length} shown
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {paginatedUsers.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow style={{ borderBottomColor: colors.border }}>
                          <SortableHead col="name" label="Name" />
                          <SortableHead col="email" label="Email" />
                          <SortableHead col="phone" label="Phone" />
                          <SortableHead col="age" label="Age" />
                          <SortableHead col="sex" label="Sex" />
                          <SortableHead col="weight" label="Weight" />
                          <SortableHead col="activityLevel" label="Activity" />
                          <SortableHead col="fitnessGoal" label="Goal" />
                          <TableHead>Allergies</TableHead>
                          <TableHead>Conditions</TableHead>
                          <SortableHead col="spiceLevel" label="Spice" />
                          <SortableHead col="frequentMeal" label="Frequent Meal" />
                          <SortableHead col="bestFood" label="Best Food" />
                          <SortableHead col="worstFood" label="Worst Food" />
                          <SortableHead col="createdAt" label="Joined" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.map((user, index) => (
                          <motion.tr
                            key={user._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="border-b last:border-0"
                            style={{ borderColor: colors.border }}
                          >
                            <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                            <TableCell className="text-sm">{user.email ?? "—"}</TableCell>
                            <TableCell className="text-sm whitespace-nowrap">{user.phone ?? "—"}</TableCell>
                            <TableCell>{user.age}</TableCell>
                            <TableCell>{user.sex}</TableCell>
                            <TableCell className="whitespace-nowrap">{user.weight} {user.weightUnit}</TableCell>
                            <TableCell>{user.activityLevel}</TableCell>
                            <TableCell className="whitespace-nowrap">{user.fitnessGoal}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {user.allergies.length > 0 ? (
                                  <>
                                    {user.allergies.slice(0, 2).map((a) => (
                                      <span
                                        key={a}
                                        className="px-1.5 py-0.5 rounded text-xs text-white whitespace-nowrap"
                                        style={{ backgroundColor: colors.sage }}
                                      >
                                        {a}
                                      </span>
                                    ))}
                                    {user.allergies.length > 2 && (
                                      <span className="text-gray-500 text-xs">+{user.allergies.length - 2}</span>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-gray-400 text-xs">None</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {user.healthConditions.length > 0 ? (
                                  <>
                                    {user.healthConditions.slice(0, 2).map((c) => (
                                      <span
                                        key={c}
                                        className="px-1.5 py-0.5 rounded text-xs text-white whitespace-nowrap"
                                        style={{ backgroundColor: "#A96B8B" }}
                                      >
                                        {c}
                                      </span>
                                    ))}
                                    {user.healthConditions.length > 2 && (
                                      <span className="text-gray-500 text-xs">+{user.healthConditions.length - 2}</span>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-gray-400 text-xs">None</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{user.spiceLevel}</TableCell>
                            <TableCell>{user.frequentMeal}</TableCell>
                            <TableCell>{user.bestFood}</TableCell>
                            <TableCell>{user.worstFood}</TableCell>
                            <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
