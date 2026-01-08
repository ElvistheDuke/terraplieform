"use client";

import { useState, useEffect } from "react";
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
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email?: string;
  age: number;
  sex: string;
  weight: number;
  weightUnit: string;
  activityLevel: string;
  allergies: string[];
  healthConditions: string[];
  spiceLevel: number;
  frequentMeal: string;
  bestFood: string;
  worstFood: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminDashboardContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, users]);

  // Analytics Data
  const activityDistribution = [
    {
      name: "Sedentary",
      value: users.filter((u) => u.activityLevel === "Sedentary").length,
    },
    {
      name: "Light",
      value: users.filter((u) => u.activityLevel === "Light").length,
    },
    {
      name: "Moderate",
      value: users.filter((u) => u.activityLevel === "Moderate").length,
    },
    {
      name: "Very Active",
      value: users.filter((u) => u.activityLevel === "Very Active").length,
    },
  ].filter((item) => item.value > 0);

  // const allergyCount: Record<string, number> = {};
  // users.forEach((user) => {
  //   user.allergies.forEach((allergy) => {
  //     allergyCount[allergy] = (allergyCount[allergy] || 0) + 1;
  //   });
  // });

  // const allergiesByFrequency = Object.entries(allergyCount)
  //   .map(([name, count]) => ({ name, value: count }))
  //   .sort((a, b) => b.value - a.value)
  //   .slice(0, 8);

  const avgWeight =
    users.length > 0
      ? (users.reduce((sum, u) => sum + u.weight, 0) / users.length).toFixed(1)
      : "0";

  const avgAge =
    users.length > 0
      ? (users.reduce((sum, u) => sum + u.age, 0) / users.length).toFixed(0)
      : "0";

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // const CHART_COLORS = [colors.sage, "#A0A86B", "#6BB8A9", "#A96B8B"]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full animate-spin"
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
    <div
      style={{ backgroundColor: colors.lightBg }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: colors.slate }}
          >
            Terraplie Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Analyze user submissions and wellness data
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card style={{ backgroundColor: colors.cream }}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="text-4xl font-bold"
                  style={{ color: colors.sage }}
                >
                  {users.length}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card style={{ backgroundColor: colors.cream }}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Average Age
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="text-4xl font-bold"
                  style={{ color: colors.sage }}
                >
                  {avgAge}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card style={{ backgroundColor: colors.cream }}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Average Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="text-4xl font-bold"
                  style={{ color: colors.sage }}
                >
                  {avgWeight}
                  <span className="text-lg ml-1">kg</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card style={{ backgroundColor: colors.cream }}>
            <CardHeader>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {paginatedUsers.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow style={{ borderBottomColor: colors.border }}>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Sex</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Activity Level</TableHead>
                          <TableHead>Allergies</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.map((user, index) => (
                          <motion.tr
                            key={user._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.age}</TableCell>
                            <TableCell>{user.sex}</TableCell>
                            <TableCell>
                              {user.weight} {user.weightUnit}
                            </TableCell>
                            <TableCell>{user.activityLevel}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {user.allergies.length > 0 ? (
                                  user.allergies.slice(0, 2).map((allergy) => (
                                    <span
                                      key={allergy}
                                      className="px-2 py-1 rounded text-xs text-white"
                                      style={{ backgroundColor: colors.sage }}
                                    >
                                      {allergy}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-400">None</span>
                                )}
                                {user.allergies.length > 2 && (
                                  <span className="text-gray-500 text-xs">
                                    +{user.allergies.length - 2}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                          size="sm"
                        >
                          <ChevronLeft size={18} />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={currentPage === totalPages}
                          size="sm"
                        >
                          <ChevronRight size={18} />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No users found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
